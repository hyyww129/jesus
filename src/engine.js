/* ==========================================================================
   BIBLE QUEST — MEMORY & MASTERY ENGINE
   ========================================================================== */

const ALL_CONCEPTS = CONCEPTS_OT.concat(CONCEPTS_NT);
const C_BY_ID = {}; ALL_CONCEPTS.forEach(c => C_BY_ID[c.id] = c);
const B_BY_ID = {}; BOOKS.forEach(b => B_BY_ID[b.id] = b);
const E_BY_ID = {}; ERAS.forEach(e => E_BY_ID[e.id] = e);
const P_BY_ID = {}; PEOPLE.forEach(p => P_BY_ID[p.id] = p);
const PL_BY_ID = {}; PLACES.forEach(p => PL_BY_ID[p.id] = p);
const ERA_ORDER = ERAS.map(e => e.id);

const TYPE_NAMES = {
  mc:'Multiple choice', tf:'True or false', who:'Who am I?', nxt:'What happened next?',
  cse:'Cause & effect', scn:'Scenario', con:'Connection', bok:'Book identification',
  fil:'Fill in the blank', ord:'Put in order', mat:'Matching', exp:'Explain your answer'
};
const CLAIM_LABEL = {
  text:'Direct biblical text', inference:'Biblical inference', common:'Common Christian reading',
  traditional:'Church tradition', debated:'Debated among Christians'
};
const LEVEL_NAMES = ['Not met','Introduced','Recognised','Understood','Connected','Mastered'];

const MIN = 60000, HOUR = 60 * MIN, DAY = 24 * HOUR;
const INTERVALS = [10 * MIN, 4 * HOUR, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
const PASS_MARK = 80;           // boss battles and exams
const ERA_UNLOCK_MASTERY = 60;  // alternative route to unlocking the next era

/* ---------------------------------------------------------------- state -- */
const BLANK = () => ({
  v: 1, created: Date.now(), session: 1, lastSeen: Date.now(),
  streak: { count: 0, day: null, best: 0 },
  c: {},          // concept records
  books: {},      // per-book completion checkmarks
  eras: {},       // boss results
  visited: [],    // place ids
  geo: {},        // place id -> where-did-this-happen record {seen,right,streak}
  who: {},        // person id -> who-am-I record {seen,right,streak}
  met: [],        // people ids
  ach: [],        // achievement ids
  exams: {},      // final + master challenge
  daily: {},      // date -> true
  log: []         // recent activity, capped
});

let S = BLANK();
let memoryOnly = false;

function rec(id) {
  if (!S.c[id]) S.c[id] = {
    seen: 0, right: 0, wrong: 0, last: 0, next: 0, run: 0, idx: 0,
    types: {}, probes: {}, sess: [], recent: []
  };
  return S.c[id];
}
function bookRec(id) {
  if (!S.books[id]) S.books[id] = { lessons: false, quiz: false, timeline: false, character: false, connection: false, mastery: false };
  return S.books[id];
}
function eraRec(id) {
  if (!S.eras[id]) S.eras[id] = { best: 0, passed: false, attempts: 0 };
  return S.eras[id];
}

/* ------------------------------------------------------------- storage -- */
const KEY = 'biblequest:save:v1';
let saveTimer = null;

async function loadState() {
  try {
    const r = await window.storage.get(KEY);
    if (r && r.value) {
      const parsed = JSON.parse(r.value);
      if (parsed && parsed.v === 1) S = Object.assign(BLANK(), parsed);
    }
  } catch (e) {
    // No saved progress yet, or storage unavailable in this environment.
    if (!window.storage) memoryOnly = true;
  }
  newSession();
}
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try { await window.storage.set(KEY, JSON.stringify(S)); }
    catch (e) { memoryOnly = true; }
  }, 400);
}
async function wipeState() {
  S = BLANK();
  try { await window.storage.delete(KEY); } catch (e) { /* nothing stored */ }
  newSession();
}

/* A session is a fresh visit, or a return after a gap. Mastery deliberately
   requires success in more than one session, so a single sitting cannot
   produce a "mastered" badge. */
function newSession() {
  const gap = Date.now() - (S.lastSeen || 0);
  if (gap > 20 * MIN) S.session = (S.session || 0) + 1;
  S.lastSeen = Date.now();
  const today = new Date().toDateString();
  if (S.streak.day !== today) {
    const y = new Date(Date.now() - DAY).toDateString();
    S.streak.count = (S.streak.day === y) ? S.streak.count + 1 : 1;
    S.streak.day = today;
    S.streak.best = Math.max(S.streak.best || 0, S.streak.count);
  }
  saveState();
}

/* --------------------------------------------------------- mastery math -- */
function conceptMastery(id) {
  const r = S.c[id], c = C_BY_ID[id];
  if (!r || !r.seen || !c) return 0;
  const attempts = r.right + r.wrong;
  const accuracy = attempts ? r.right / attempts : 0;

  const available = new Set(c.p.map(p => p.t));
  const covered = Object.keys(r.types).filter(t => r.types[t].right > 0).length;
  const coverage = available.size ? Math.min(1, covered / available.size) : 0;

  const persistence = Math.min(1, r.sess.length / 3);

  let m = 100 * (0.40 * accuracy + 0.35 * coverage + 0.25 * persistence);

  // One lucky answer should not read as two thirds of a topic. Mastery is
  // damped until the concept has actually been met several times.
  m *= Math.min(1, 0.40 + 0.15 * r.seen);

  // A recent miss should visibly knock mastery down.
  const recent = r.recent.slice(-3);
  if (recent.length && recent[recent.length - 1] === 0) m *= 0.85;

  // Knowledge fades. Past twice the scheduled gap, confidence in it drops.
  if (r.next && Date.now() > r.next) {
    const overdue = (Date.now() - r.next) / (INTERVALS[Math.min(r.idx, 6)] || DAY);
    m *= Math.max(0.6, 1 - 0.12 * overdue);
  }
  return Math.max(0, Math.min(100, Math.round(m)));
}

function conceptLevel(id) {
  const r = S.c[id];
  if (!r || !r.seen) return 0;
  const c = C_BY_ID[id], m = conceptMastery(id);
  const bestRight = Math.max(0, ...c.p.map((p, i) =>
    (r.probes[i] && r.probes[i].right) ? (p.l || 1) : 0));
  const typesRight = Object.keys(r.types).filter(t => r.types[t].right > 0).length;
  const last3 = r.recent.slice(-3);
  if (m >= 88 && typesRight >= 4 && r.sess.length >= 2 &&
      last3.length >= 3 && last3.every(x => x === 1)) return 5;
  if (m >= 70 && bestRight >= 4) return 4;
  if (m >= 45 && bestRight >= 3) return 3;
  if (m >= 20 && r.right >= 1) return 2;
  return 1;
}

function confidence(id) {
  const r = S.c[id];
  if (!r || !r.seen) return { label: 'Unknown', pct: 0 };
  const m = conceptMastery(id);
  const overdue = r.next && Date.now() > r.next;
  const pct = Math.max(0, Math.round(m * (overdue ? 0.8 : 1)));
  const label = pct >= 85 ? 'Strong' : pct >= 60 ? 'Solid' : pct >= 35 ? 'Building' : 'Shaky';
  return { label, pct };
}

function isDue(id) {
  const r = S.c[id];
  return r && r.seen > 0 && Date.now() >= r.next;
}

/* ---------------------------------------------------- recording answers -- */
/* result: 'right' | 'partial' | 'wrong' */
function recordAnswer(cid, probeIdx, result) {
  const c = C_BY_ID[cid]; if (!c) return;
  const r = rec(cid), p = c.p[probeIdx];
  const t = p.t;
  r.seen++;
  r.last = Date.now();
  if (!r.types[t]) r.types[t] = { right: 0, wrong: 0 };
  if (!r.probes[probeIdx]) r.probes[probeIdx] = { seen: 0, right: 0 };
  r.probes[probeIdx].seen++;

  if (result === 'right') {
    r.right++; r.run++; r.types[t].right++; r.probes[probeIdx].right++;
    r.recent.push(1);
    r.idx = Math.min(r.idx + 1, INTERVALS.length - 1);
    if (!r.sess.includes(S.session)) r.sess.push(S.session);
  } else if (result === 'wrong') {
    r.wrong++; r.run = 0; r.types[t].wrong++;
    r.recent.push(0);
    r.idx = 0;
  } else {
    r.recent.push(0.5);
    r.idx = Math.max(0, r.idx - 1);
  }
  if (r.recent.length > 12) r.recent = r.recent.slice(-12);
  r.next = Date.now() + INTERVALS[r.idx];
  saveState();
}

/* ------------------------------------------------------ probe selection -- */
function probeCandidates(cid, opts) {
  const c = C_BY_ID[cid]; if (!c) return [];
  const o = opts || {};
  let list = c.p.map((p, i) => ({ cid, i, p }));
  if (o.minLevel) list = list.filter(x => (x.p.l || 1) >= o.minLevel);
  if (o.types) list = list.filter(x => o.types.includes(x.p.t));
  if (o.excludeTypes) list = list.filter(x => !o.excludeTypes.includes(x.p.t));
  if (o.unseenOnly) {
    const r = S.c[cid];
    list = list.filter(x => !r || !r.probes[x.i] || !r.probes[x.i].seen);
  }
  if (o.exclude) list = list.filter(x => !o.exclude.has(cid + ':' + x.i));
  return list;
}

/* Deliberately biased toward probes the player has seen least, so returning
   to a concept means meeting it from a new angle rather than re-reading an
   answer already memorised. */
function pickProbe(cid, opts) {
  let list = probeCandidates(cid, opts);
  if (!list.length && opts && (opts.unseenOnly || opts.minLevel || opts.types)) {
    const relaxed = Object.assign({}, opts);
    delete relaxed.unseenOnly; delete relaxed.minLevel; delete relaxed.types;
    list = probeCandidates(cid, relaxed);
  }
  if (!list.length) return null;
  const r = S.c[cid];
  const seenCount = x => (r && r.probes[x.i] ? r.probes[x.i].seen : 0);
  const min = Math.min(...list.map(seenCount));
  const freshest = list.filter(x => seenCount(x) === min);
  return freshest[Math.floor(Math.random() * freshest.length)];
}

function buildQuiz(conceptIds, count, opts) {
  const o = opts || {};
  const used = o.exclude || new Set();
  const out = [];
  const pool = shuffle(conceptIds.slice());
  let guard = 0;
  while (out.length < count && guard < count * 12) {
    guard++;
    for (const cid of pool) {
      if (out.length >= count) break;
      const pick = pickProbe(cid, Object.assign({}, o, { exclude: used }));
      if (!pick) continue;
      used.add(cid + ':' + pick.i);
      out.push(pick);
    }
    if (pool.every(cid => !pickProbe(cid, Object.assign({}, o, { exclude: used })))) break;
  }
  return shuffle(out).slice(0, count);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------ groupings -- */
function conceptsInEra(eid) { return ALL_CONCEPTS.filter(c => c.e === eid).map(c => c.id); }
function conceptsInBook(bid) { return ALL_CONCEPTS.filter(c => c.b === bid).map(c => c.id); }
function conceptsUpTo(eid) {
  const n = ERA_ORDER.indexOf(eid);
  return ALL_CONCEPTS.filter(c => ERA_ORDER.indexOf(c.e) <= n).map(c => c.id);
}
function seenConcepts() { return Object.keys(S.c).filter(id => S.c[id].seen > 0 && C_BY_ID[id]); }

function avgMastery(ids) {
  if (!ids.length) return 0;
  return Math.round(ids.reduce((s, id) => s + conceptMastery(id), 0) / ids.length);
}
function eraMastery(eid) { return avgMastery(conceptsInEra(eid)); }
function bookConceptMastery(bid) {
  const ids = conceptsInBook(bid);
  return ids.length ? avgMastery(ids) : 0;
}

/* A book is only complete when all six gates are passed — clicking through
   the lesson is one of six, never enough on its own. */
function bookProgress(bid) {
  const b = bookRec(bid);
  const gates = ['lessons', 'quiz', 'timeline', 'character', 'connection', 'mastery'];
  const done = gates.filter(g => b[g]).length;
  const ids = conceptsInBook(bid);
  let cm;
  if (ids.length) {
    cm = bookConceptMastery(bid);
  } else {
    // Books without their own concept drills are still assessed, using the
    // stages they belong to — otherwise they could never be completed.
    const pool = (B_BY_ID[bid].eras || []).reduce((a, e) => a.concat(conceptsInEra(e)), []);
    cm = pool.length ? avgMastery(pool) : 0;
  }
  const pct = Math.round(0.55 * cm + 0.45 * (done / gates.length) * 100);
  return { done, gates: gates.length, pct: Math.min(100, pct), complete: done === gates.length && cm >= 75 };
}

function overallMastery() {
  const all = ALL_CONCEPTS.map(c => c.id);
  return avgMastery(all);
}
function testamentMastery(t) {
  const ids = ALL_CONCEPTS.filter(c => B_BY_ID[c.b] && B_BY_ID[c.b].t === t).map(c => c.id);
  return avgMastery(ids);
}

function eraUnlocked(eid) {
  const i = ERA_ORDER.indexOf(eid);
  if (i <= 0) return true;
  const prev = ERA_ORDER[i - 1];
  return eraRec(prev).passed || eraMastery(prev) >= ERA_UNLOCK_MASTERY;
}

/* ------------------------------------------------------- review & daily -- */
function reviewQueue(limit) {
  const seen = seenConcepts();
  const scored = seen.map(id => {
    const m = conceptMastery(id), r = S.c[id];
    const overdue = Math.max(0, Date.now() - r.next) / DAY;
    return { id, m, score: (100 - m) + Math.min(40, overdue * 8) };
  }).sort((a, b) => b.score - a.score);
  return scored.slice(0, limit || 12);
}

function weakConcepts(n) {
  return reviewQueue(60).filter(x => x.m < 70).slice(0, n || 8).map(x => x.id);
}
function strongConcepts(n) {
  return seenConcepts().map(id => ({ id, m: conceptMastery(id) }))
    .sort((a, b) => b.m - a.m).slice(0, n || 5);
}
function unlockedConcepts() {
  return ALL_CONCEPTS.filter(c => eraUnlocked(c.e)).map(c => c.id);
}

/* 5 old + 3 weak + 2 new, exactly as the daily brief promises. */
function dailySet() {
  const seen = seenConcepts();
  const weak = weakConcepts(3);
  const old = seen.filter(id => !weak.includes(id))
    .map(id => ({ id, r: S.c[id] }))
    .sort((a, b) => a.r.next - b.r.next).slice(0, 5).map(x => x.id);
  const fresh = unlockedConcepts().filter(id => !S.c[id] || !S.c[id].seen).slice(0, 2);
  const ids = old.concat(weak, fresh);
  return ids.length ? ids : unlockedConcepts().slice(0, 10);
}
function dailyDone() { return !!S.daily[new Date().toDateString()]; }

/* --------------------------------------------------------- achievements -- */
const ACHIEVEMENTS = [
  { id: 'a_gen', em: '📖', n: 'Genesis Explorer', d: 'Reach 70% mastery across Creation & Early History.', f: () => eraMastery('creation') >= 70 },
  { id: 'a_exo', em: '🔥', n: 'Exodus Survivor', d: 'Pass the Exodus & Law boss battle.', f: () => eraRec('exodus').passed },
  { id: 'a_kings', em: '👑', n: 'Kings & Kingdoms', d: 'Pass both the United and Divided Kingdom boss battles.', f: () => eraRec('united').passed && eraRec('divided').passed },
  { id: 'a_wis', em: '🧠', n: 'Wisdom Seeker', d: 'Reach 70% mastery in Wisdom & Poetry.', f: () => eraMastery('wisdom') >= 70 },
  { id: 'a_pro', em: '📜', n: 'Prophet Scholar', d: 'Pass both the Major and Minor Prophets boss battles.', f: () => eraRec('majorprophets').passed && eraRec('minorprophets').passed },
  { id: 'a_gos', em: '✝️', n: 'Gospel Master', d: 'Pass the Life of Jesus boss battle.', f: () => eraRec('jesus').passed },
  { id: 'a_acts', em: '🕊️', n: 'Acts Explorer', d: 'Pass the Early Church boss battle.', f: () => eraRec('church').passed },
  { id: 'a_paul', em: '🌎', n: 'Paul\u2019s Journey', d: 'Pass the Paul\u2019s Ministry boss battle.', f: () => eraRec('paul').passed },
  { id: 'a_ot', em: '📚', n: 'Old Testament Scholar', d: 'Reach 75% mastery across the Old Testament.', f: () => testamentMastery('OT') >= 75 },
  { id: 'a_nt', em: '📖', n: 'New Testament Scholar', d: 'Reach 75% mastery across the New Testament.', f: () => testamentMastery('NT') >= 75 },
  { id: 'a_geo', em: '🗺️', n: 'Bible Geography Expert', d: 'Visit every location on the map.', f: () => S.visited.length >= PLACES.length },
  { id: 'a_georight', em: '🎯', n: 'Well Placed', d: 'Have ten places sure (three straight correct) in the map challenge.', f: () => geoStats().known >= 10 },
  { id: 'a_whoami', em: '👁️', n: 'Known by Sight', d: 'Have ten people sure in the Who am I challenge.', f: () => whoStats().known >= 10 },
  { id: 'a_time', em: '⏳', n: 'Timeline Master', d: 'Score full marks on a timeline ordering challenge.', f: () => !!S.timelineMastered },
  { id: 'a_conn', em: '🧩', n: 'Connection Master', d: 'Answer 25 connection questions correctly.', f: () => countTypeRight('con') >= 25 },
  { id: 'a_streak', em: '🔥', n: 'Seven Day Pilgrim', d: 'Keep a seven day streak.', f: () => (S.streak.count || 0) >= 7 },
  { id: 'a_people', em: '👥', n: 'Company of Witnesses', d: 'Study twenty people in the character database.', f: () => S.met.length >= 20 },
  { id: 'a_five', em: '⭐', n: 'First Mastery', d: 'Take one concept all the way to level five.', f: () => ALL_CONCEPTS.some(c => conceptLevel(c.id) === 5) },
  { id: 'a_exam', em: '🎓', n: 'Examined', d: 'Pass the Ultimate Bible Mastery Exam.', f: () => S.exams.final && S.exams.final.passed },
  { id: 'a_master', em: '🏆', n: 'Scripture Master', d: 'Pass the Scripture Master Challenge.', f: () => S.exams.master && S.exams.master.passed }
];

function countTypeRight(t) {
  return Object.keys(S.c).reduce((n, id) =>
    n + ((S.c[id].types[t] && S.c[id].types[t].right) || 0), 0);
}
function checkAchievements() {
  const fresh = [];
  ACHIEVEMENTS.forEach(a => {
    if (!S.ach.includes(a.id) && a.f()) { S.ach.push(a.id); fresh.push(a); }
  });
  if (fresh.length) saveState();
  return fresh;
}

/* ---------------------------------------------------- test constructors -- */
function bossQuiz(eid) {
  const era = E_BY_ID[eid];
  const own = conceptsInEra(eid);
  const earlier = conceptsUpTo(eid).filter(id => !own.includes(id));
  const n = era.boss;
  const fromEarlier = Math.min(Math.floor(n * 0.3), earlier.length);
  const used = new Set();
  const a = buildQuiz(own, n - fromEarlier, { exclude: used });
  const b = earlier.length ? buildQuiz(earlier, fromEarlier, { exclude: used }) : [];
  return shuffle(a.concat(b));
}

/* Deliberately avoids anything the player has already answered, so it tests
   transfer rather than recall of a specific question. */
function transferQuiz(ids, n) {
  const pool = ids.length ? ids : unlockedConcepts();
  let q = buildQuiz(pool, n, { unseenOnly: true, minLevel: 4 });
  if (q.length < n) {
    const more = buildQuiz(pool, n - q.length, { unseenOnly: true, exclude: new Set(q.map(x => x.cid + ':' + x.i)) });
    q = q.concat(more);
  }
  return q.slice(0, n);
}

function finalExamQuiz() {
  const used = new Set();
  const parts = [];
  ERA_ORDER.forEach(eid => {
    const ids = conceptsInEra(eid);
    if (ids.length) parts.push(...buildQuiz(ids, Math.max(3, Math.round(100 / ERA_ORDER.length)), { unseenOnly: true, exclude: used }));
  });
  let q = shuffle(parts);
  if (q.length < 100) {
    q = q.concat(buildQuiz(ALL_CONCEPTS.map(c => c.id), 100 - q.length, { exclude: used }));
  }
  return shuffle(q).slice(0, 100);
}

function masterChallengeQuiz() {
  const hard = ['con', 'ord', 'mat', 'scn', 'cse', 'exp', 'bok'];
  const used = new Set();
  let q = buildQuiz(ALL_CONCEPTS.map(c => c.id), 40, { types: hard, minLevel: 4, exclude: used });
  if (q.length < 40) q = q.concat(buildQuiz(ALL_CONCEPTS.map(c => c.id), 40 - q.length, { types: hard, exclude: used }));
  return shuffle(q).slice(0, 40);
}

/* ------------------------------------------------------ answer checking -- */
function gradeChoice(probe, chosen) { return chosen === probe.a; }
function gradeOrder(probe, arrangement) {
  return arrangement.length === probe.it.length &&
         arrangement.every((v, i) => v === probe.it[i]);
}
function gradeMatch(probe, pairs) {
  return probe.pr.every(([l, r]) => pairs[l] === r);
}
function gradeExplain(probe, text) {
  const t = (text || '').toLowerCase();
  const hits = probe.keys.filter(k => t.includes(k.toLowerCase()));
  return { hits, ratio: probe.keys.length ? hits.length / probe.keys.length : 0 };
}

/* --------------------------------------------------------------- misc -- */
function markBookGate(bid, gate) {
  const b = bookRec(bid);
  if (!b[gate]) { b[gate] = true; saveState(); }
}
function visitPlace(id) { if (!S.visited.includes(id)) { S.visited.push(id); saveState(); } }
function meetPerson(id) { if (!S.met.includes(id)) { S.met.push(id); saveState(); } }

/* Recognition tracks — the map's "where did this happen?" and the people
   "who am I?" challenges. Places and people are not concepts, so each gets
   its own track rather than fake concept records. Three straight correct
   answers mark an item "sure"; a miss resets its streak — the same spirit
   as concept mastery: streaks, not one-offs. */
function trackRecord(store, id, correct) {
  if (!S[store]) S[store] = {};
  const g = S[store][id] || (S[store][id] = { seen: 0, right: 0, streak: 0 });
  g.seen++;
  if (correct) { g.right++; g.streak++; } else { g.streak = 0; }
  saveState();
  return g;
}
function trackStats(store) {
  const recs = Object.values(S[store] || {});
  const seen = recs.reduce((n, g) => n + g.seen, 0);
  const right = recs.reduce((n, g) => n + g.right, 0);
  const known = recs.filter(g => g.streak >= 3).length;
  return { seen, right, known, pct: seen ? Math.round(right / seen * 100) : 0 };
}
/* Pick challenge targets, weakest first: never-asked, then broken streaks,
   then everything else — shuffled within each band. */
function trackPickTargets(store, list, n) {
  const band = p => {
    const g = (S[store] || {})[p.id];
    return !g ? 0 : g.streak === 0 ? 1 : g.streak < 3 ? 2 : 3;
  };
  return list.slice()
    .map(p => ({ p, k: band(p) + Math.random() * 0.9 }))
    .sort((a, b) => a.k - b.k)
    .slice(0, n).map(x => x.p);
}
function recordGeo(placeId, correct) { return trackRecord('geo', placeId, correct); }
function geoStats() { return trackStats('geo'); }
function geoPickTargets(n) { return trackPickTargets('geo', PLACES, n); }
function recordWho(personId, correct) { return trackRecord('who', personId, correct); }
function whoStats() { return trackStats('who'); }
function whoPickTargets(n) { return trackPickTargets('who', PEOPLE, n); }

function pushLog(entry) {
  S.log.unshift(Object.assign({ at: Date.now() }, entry));
  if (S.log.length > 40) S.log.length = 40;
  saveState();
}

function fmtWhen(ts) {
  if (!ts) return 'not scheduled';
  const d = ts - Date.now();
  if (d <= 0) return 'due now';
  if (d < HOUR) return 'in ' + Math.max(1, Math.round(d / MIN)) + ' min';
  if (d < DAY) return 'in ' + Math.round(d / HOUR) + ' h';
  return 'in ' + Math.round(d / DAY) + ' day' + (Math.round(d / DAY) === 1 ? '' : 's');
}
