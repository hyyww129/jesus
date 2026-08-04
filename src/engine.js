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
  reader: null,   // last scripture reader position {b, c}
  drilled: [],    // 'bookId:chapter' keys of generated scripture drills
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
  restoreDrills();
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
/* Hand-authored concepts only — generated scripture drills (c.gen) stay out
   of era progression, book gates, boss battles and the exams. They still
   flow through mastery, the review queue and the daily set once studied. */
function curatedConcepts() { return ALL_CONCEPTS.filter(c => !c.gen); }
function conceptsInEra(eid) { return curatedConcepts().filter(c => c.e === eid).map(c => c.id); }
function conceptsInBook(bid) { return curatedConcepts().filter(c => c.b === bid).map(c => c.id); }
function conceptsUpTo(eid) {
  const n = ERA_ORDER.indexOf(eid);
  return curatedConcepts().filter(c => ERA_ORDER.indexOf(c.e) <= n).map(c => c.id);
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

/* Headline aggregates cover the curated curriculum only — generated drills
   are extra practice and must not move (or dilute) the overall numbers. */
function overallMastery() {
  return avgMastery(curatedConcepts().map(c => c.id));
}
function testamentMastery(t) {
  const ids = curatedConcepts().filter(c => B_BY_ID[c.b] && B_BY_ID[c.b].t === t).map(c => c.id);
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
  return curatedConcepts().filter(c => eraUnlocked(c.e)).map(c => c.id);
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
    q = q.concat(buildQuiz(curatedConcepts().map(c => c.id), 100 - q.length, { exclude: used }));
  }
  return shuffle(q).slice(0, 100);
}

function masterChallengeQuiz() {
  const hard = ['con', 'ord', 'mat', 'scn', 'cse', 'exp', 'bok'];
  const used = new Set();
  let q = buildQuiz(curatedConcepts().map(c => c.id), 40, { types: hard, minLevel: 4, exclude: used });
  if (q.length < 40) q = q.concat(buildQuiz(curatedConcepts().map(c => c.id), 40 - q.length, { types: hard, exclude: used }));
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
function setReaderPos(b, c) { S.reader = { b, c }; saveState(); }

/* ------------------------------------------------- scripture drills ----- */
/* Concepts generated from the KJV text itself. Everything is deterministic —
   the same chapter always yields the same probes in the same order, so
   recorded answers stay aligned across sessions. Registered drills join the
   real mastery engine (levels, spaced repetition, review queue); the curated
   pools above keep them out of bosses and exams. */
const DRILL_STOP = new Set(('the and that shall unto with for his they them thou thee thy have from were will not but was all are which when their your this out upon him her hath than then into also came come said saith went even more they what who whom whose there here where because before after against among over under about every any some very much many'
).split(' '));
function drillWords(text) { return text.replace(/[^A-Za-z\s']/g, ' ').split(/\s+/).filter(Boolean); }
function drillKeyWord(text) {
  let best = '';
  drillWords(text).forEach(w => {
    if (!DRILL_STOP.has(w.toLowerCase()) && w.length > best.length) best = w;
  });
  return best;
}
function drillId(b, c) { return 'kjv_' + b + '_' + c; }

function makeDrillConcept(b, c) {
  const bk = B_BY_ID[b], verses = KJV[b][c - 1];
  const name = bk.name + ' ' + c;
  const at = v => name + ':' + v;
  const clip = (t, n) => t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
  /* verses ranked longest-first; ties keep canonical order */
  const ranked = verses.map((t, i) => ({ t, i }))
    .sort((a, b2) => b2.t.length - a.t.length || a.i - b2.i);
  const p = [];

  /* fill-in-the-blank from the most substantial verses */
  const keyPool = ranked.map(x => drillKeyWord(x.t)).filter(w => w.length >= 4);
  ranked.slice(0, 4).forEach(x => {
    const word = drillKeyWord(x.t);
    if (word.length < 4 || drillWords(x.t).length < 6) return;
    const blanked = x.t.replace(new RegExp('\\b' + word + '\\b'), '____');
    if (blanked === x.t) return;
    const distract = [];
    for (const w of keyPool) {
      if (w.toLowerCase() !== word.toLowerCase() && !distract.some(d => d.toLowerCase() === w.toLowerCase())) distract.push(w);
      if (distract.length === 3) break;
    }
    if (distract.length < 3) return;
    const o = distract.slice();
    o.splice(x.i % 4 > 3 ? 3 : x.i % 4, 0, word);
    p.push({ t: 'fil', l: 2, q: 'Fill the blank — ' + at(x.i + 1) + ': “' + blanked + '”',
      o, a: o.indexOf(word), w: 'The verse reads “' + clip(x.t, 120) + '” (' + at(x.i + 1) + ').' });
  });

  /* which book is this from */
  const bi = BOOKS.indexOf(bk);
  const bookOpts = [bk.name];
  [bi - 1, bi + 1, (bi + 17) % 66, bi - 2, bi + 2].forEach(j => {
    if (bookOpts.length < 4 && j >= 0 && j < 66 && !bookOpts.includes(BOOKS[j].name)) bookOpts.push(BOOKS[j].name);
  });
  ranked.slice(0, 2).forEach((x, k) => {
    const o = bookOpts.slice(1);
    o.splice((c + k) % 4 > 3 ? 3 : (c + k) % 4, 0, bk.name);
    p.push({ t: 'bok', l: 2, q: 'Which book does this come from? “' + clip(x.t, 140) + '”',
      o, a: o.indexOf(bk.name), w: 'It is ' + at(x.i + 1) + '.' });
  });

  /* true/false against a neighbouring chapter */
  const nc = c > 1 ? c - 1 : (c < bk.ch ? c + 1 : 0);
  if (c % 2 === 0 || !nc) {
    const x = ranked[Math.min(4, ranked.length - 1)];
    p.push({ t: 'tf', l: 2, q: 'True or false — this line is from ' + name + ': “' + clip(x.t, 140) + '”',
      o: ['True', 'False'], a: 0, w: 'It is ' + at(x.i + 1) + '.' });
  } else {
    const nv = KJV[b][nc - 1];
    const foreign = nv.slice().sort((a, b2) => b2.length - a.length)[0];
    p.push({ t: 'tf', l: 2, q: 'True or false — this line is from ' + name + ': “' + clip(foreign, 140) + '”',
      o: ['True', 'False'], a: 1, w: 'It is from ' + bk.name + ' ' + nc + ', the neighbouring chapter.' });
  }

  /* put consecutive verses in order */
  if (verses.length >= 4) {
    const start = Math.floor((verses.length - 4) / 2);
    const items = verses.slice(start, start + 4).map(t => clip(t, 52));
    if (new Set(items).size === 4) {
      p.push({ t: 'ord', l: 3, q: 'Put these lines from ' + name + ' in the order they occur.',
        it: items, w: 'They run ' + at(start + 1) + '–' + (start + 4) + '.' });
    }
  }

  /* memorisation: honest recall of the opening verse */
  const v1 = verses[0];
  const keys = [];
  drillWords(v1).forEach(w => {
    const lw = w.toLowerCase();
    if (w.length >= 4 && !DRILL_STOP.has(lw) && !keys.includes(lw) && keys.length < 4) keys.push(lw);
  });
  p.push({ t: 'exp', l: 5, q: 'From memory: how does ' + name + ' open? Give the sense of verse 1 in its own words.',
    keys: keys.length ? keys : [drillWords(v1)[0].toLowerCase()], model: v1 });

  return { id: drillId(b, c), b, e: bk.eras[0], topic: name + ' — the text', d: 2, gen: true,
    claim: 'text', ref: name,
    sum: 'Drilled straight from the King James text of ' + name + '. Every question here is generated from the chapter itself.',
    p };
}

function registerDrill(b, c) {
  const id = drillId(b, c);
  if (C_BY_ID[id]) return C_BY_ID[id];
  if (!B_BY_ID[b] || !KJV[b] || !KJV[b][c - 1]) return null;
  const concept = makeDrillConcept(b, c);
  ALL_CONCEPTS.push(concept);
  C_BY_ID[id] = concept;
  const key = b + ':' + c;
  if (!S.drilled) S.drilled = [];
  if (!S.drilled.includes(key)) { S.drilled.push(key); saveState(); }
  return concept;
}
/* Re-register everything the player has drilled, so records in S.c stay
   attached to live concepts after a reload. */
function restoreDrills() {
  (S.drilled || []).forEach(k => {
    const [b, c] = k.split(':');
    if (B_BY_ID[b] && KJV[b] && KJV[b][+c - 1] && !C_BY_ID[drillId(b, +c)]) registerDrill(b, +c);
  });
}

/* ------------------------------------------------ reference resolution -- */
/* Resolve a normalised book key ("gen", "psalms", "1corinthians", a prefix)
   to a BOOKS entry, or null. Shared by the reader's jump box, the Read-it
   buttons, and the data tests. */
function findBookByKey(key) {
  const norm = s => s.toLowerCase().replace(/[.\s]+/g, '');
  const k = norm(key);
  if (!k) return null;
  return BOOKS.find(b => b.id === k)
    || BOOKS.find(b => norm(b.name) === k)
    || BOOKS.find(b => norm(b.name).indexOf(k) === 0)
    || null;
}

/* Parse a human reference string ("Genesis 1–2; Acts 16:11-40", "Daniel 1;
   3; 6", "Joshua 2, 6", "Exodus 2 – Deuteronomy 34", "1–2 Timothy",
   "Isaiah 52:13 – 53:12", "Psalms") into concrete KJV spans.
   Returns { segs, loose, broken }:
     segs   [{aBi,aC,aV,bBi,bC,bV}] — book-index/chapter/verse start→end
     loose  segments with no recognisable book ("Gospels", "the letters")
     broken segments naming real books but impossible chapters/verses.
   Bare numbers inherit the most recent book, as the data does. */
function parseRefRanges(str) {
  const out = { segs: [], loose: [], broken: [] };
  const bi = b => BOOKS.indexOf(b);
  const lastCh = b => b.ch;
  const lastV = (b, c) => KJV[b.id][c - 1].length;
  let inherit = null;

  const point = (s, role, ownBookRequired) => {
    /* "book", "book C", "book C:V", "C", "C:V" -> {b,c,v} or string error */
    const m = s.match(/^(?:([1-3]?\s*[a-z][a-z .]*?)\s+)?(\d+)(?::(\d+))?$/i) ||
              s.match(/^([1-3]?\s*[a-z][a-z .]*)$/i);
    if (!m) return 'unreadable "' + s + '"';
    const b = m[1] ? findBookByKey(m[1]) : (ownBookRequired ? findBookByKey(s) : inherit);
    if (!b) return null; /* no book — caller decides loose */
    const c = m[2] ? parseInt(m[2], 10) : (role === 'start' ? 1 : lastCh(b));
    if (c < 1 || c > b.ch) return '"' + s + '" — ' + b.name + ' has ' + b.ch + ' chapters';
    const v = m[3] ? parseInt(m[3], 10) : (role === 'start' ? 1 : lastV(b, c));
    if (v < 1 || v > lastV(b, c)) return '"' + s + '" — ' + b.name + ' ' + c + ' has ' + lastV(b, c) + ' verses';
    return { b, c, v, cGiven: !!m[2], vGiven: !!m[3] };
  };

  const push = (a, b2) => {
    const seg = { aBi: bi(a.b), aC: a.c, aV: a.v, bBi: bi(b2.b), bC: b2.c, bV: b2.v };
    if (seg.aBi > seg.bBi || (seg.aBi === seg.bBi && (seg.aC > seg.bC || (seg.aC === seg.bC && seg.aV > seg.bV)))) {
      out.broken.push('range runs backwards'); return;
    }
    out.segs.push(seg);
  };

  String(str || '').split(';').forEach(rawSeg => {
    rawSeg.split(',').forEach(rawItem => {
      let s = rawItem.trim().replace(/[–—−]/g, '-').replace(/\s+/g, ' ');
      if (!s) return;
      /* "1-2 Timothy": a range of numbered books */
      let m = s.match(/^([1-3])\s*-\s*([1-3])\s+([a-z][a-z .]*)$/i);
      if (m) {
        const b1 = findBookByKey(m[1] + m[3]), b2 = findBookByKey(m[2] + m[3]);
        if (!b1 || !b2) { out.loose.push(rawItem.trim()); return; }
        push({ b: b1, c: 1, v: 1 }, { b: b2, c: lastCh(b2), v: lastV(b2, lastCh(b2)) });
        inherit = b2; return;
      }
      /* two-point range where the right side names a book or a chapter:verse */
      m = s.match(/^(.+?)\s*-\s*(.+)$/);
      if (m && (/[a-z]/i.test(m[2]) || m[2].includes(':'))) {
        const a = point(m[1], 'start', false);
        if (typeof a === 'string') { out.broken.push(a); return; }
        if (!a) { out.loose.push(rawItem.trim()); return; }
        inherit = a.b;
        const b2 = point(m[2], 'end', /[a-z]/i.test(m[2]));
        if (typeof b2 === 'string') { out.broken.push(b2); return; }
        if (!b2) { out.loose.push(rawItem.trim()); return; }
        inherit = b2.b;
        push(a, b2); return;
      }
      /* single-book forms: "book C[-C2]", "book C:V[-V2]", "C", "C:V", "C-C2", "V-V2 after :", "book" */
      m = s.match(/^(?:([1-3]?\s*[a-z][a-z .]*?)\s+)?(\d+)(?::(\d+))?(?:\s*-\s*(\d+))?$/i);
      if (m) {
        const b = m[1] ? findBookByKey(m[1]) : inherit;
        if (!b) { out.loose.push(rawItem.trim()); return; }
        inherit = b;
        const c1 = parseInt(m[2], 10);
        if (c1 < 1 || c1 > b.ch) { out.broken.push('"' + s + '" — ' + b.name + ' has ' + b.ch + ' chapters'); return; }
        const v1 = m[3] ? parseInt(m[3], 10) : null;
        if (v1 && v1 > lastV(b, c1)) { out.broken.push('"' + s + '" — ' + b.name + ' ' + c1 + ' has ' + lastV(b, c1) + ' verses'); return; }
        if (m[4]) {
          const n2 = parseInt(m[4], 10);
          if (v1) { /* verse range within the chapter */
            if (n2 < v1 || n2 > lastV(b, c1)) { out.broken.push('"' + s + '" — ' + b.name + ' ' + c1 + ' has ' + lastV(b, c1) + ' verses'); return; }
            push({ b, c: c1, v: v1 }, { b, c: c1, v: n2 });
          } else { /* chapter range */
            if (n2 < c1 || n2 > b.ch) { out.broken.push('"' + s + '" — ' + b.name + ' has ' + b.ch + ' chapters'); return; }
            push({ b, c: c1, v: 1 }, { b, c: n2, v: lastV(b, n2) });
          }
        } else {
          push({ b, c: c1, v: v1 || 1 }, { b, c: c1, v: v1 || lastV(b, c1) });
        }
        return;
      }
      /* whole book */
      const wb = findBookByKey(s);
      if (wb) { inherit = wb; push({ b: wb, c: 1, v: 1 }, { b: wb, c: lastCh(wb), v: lastV(wb, lastCh(wb)) }); return; }
      out.loose.push(rawItem.trim());
    });
  });
  return out;
}
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
