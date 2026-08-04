/* ==========================================================================
   BIBLE QUEST — INTERFACE
   ========================================================================== */
const app = () => document.getElementById('view');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let VIEW = { name: 'journey', arg: null };

const NAV = [
  { g: 'The journey' },
  { id: 'journey', ic: '❦', n: 'Bible journey' },
  { id: 'books', ic: '▤', n: 'The 66 books' },
  { id: 'timeline', ic: '⏳', n: 'Timeline' },
  { id: 'map', ic: '⌖', n: 'Map' },
  { id: 'people', ic: '☙', n: 'People' },
  { id: 'palace', ic: '⌂', n: 'Memory palace' },
  { g: 'Practice' },
  { id: 'daily', ic: '☀', n: 'Daily challenge' },
  { id: 'review', ic: '↻', n: 'Review quest' },
  { id: 'transfer', ic: '?', n: 'Do I really know this?' },
  { g: 'Examinations' },
  { id: 'final', ic: '✦', n: 'Final exam' },
  { id: 'master', ic: '♔', n: 'Master challenge' },
  { g: 'Progress' },
  { id: 'dashboard', ic: '◎', n: 'Dashboard' },
  { id: 'achievements', ic: '★', n: 'Achievements' },
  { id: 'about', ic: 'ℹ', n: 'How this works' }
];

function go(name, arg) {
  VIEW = { name, arg: arg === undefined ? null : arg };
  window.scrollTo(0, 0);
  render();
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 3200);
}
function celebrate(list) { if (list.length) toast('Achievement unlocked — ' + list.map(a => a.em + ' ' + a.n).join(' · ')); }

function renderNav() {
  const rail = document.getElementById('rail-nav');
  const bar = document.getElementById('mobar');
  const due = reviewQueue(60).filter(x => isDue(x.id)).length;
  rail.innerHTML = NAV.map(item => {
    if (item.g) return `<div class="navgrp">${item.g}</div>`;
    let tag = '';
    if (item.id === 'review' && due) tag = `<span class="tag red">${due}</span>`;
    if (item.id === 'daily' && !dailyDone()) tag = `<span class="tag">new</span>`;
    return `<button class="navbtn ${VIEW.name === item.id ? 'on' : ''}" data-go="${item.id}">
      <span class="ic">${item.ic}</span><span>${item.n}</span>${tag}</button>`;
  }).join('');
  const mob = ['journey', 'books', 'daily', 'review', 'dashboard'];
  bar.innerHTML = NAV.filter(i => mob.includes(i.id)).map(i =>
    `<button class="${VIEW.name === i.id ? 'on' : ''}" data-go="${i.id}"><span class="ic">${i.ic}</span>${i.n.split(' ')[0]}</button>`).join('');
}

function bar(pct, cls) { return `<div class="bar ${cls || ''}"><i style="width:${Math.max(2, pct)}%"></i></div>`; }
function lvlDots(n) { return `<span class="lvl">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`; }
function claimTag(c) { return `<span class="claim ${c}">${CLAIM_LABEL[c]}</span>`; }
function dotFor(m) { return m >= 75 ? 'grn' : m >= 45 ? 'yel' : 'red'; }

/* ============================== THE JOURNEY ============================== */
function viewJourney() {
  const om = overallMastery();
  const rows = ERAS.map((e, i) => {
    const m = eraMastery(e.id), unlocked = eraUnlocked(e.id), passed = eraRec(e.id).passed;
    const bookNames = e.books.map(b => B_BY_ID[b] && B_BY_ID[b].name).filter(Boolean);
    return `<div class="era ${passed ? 'done' : ''} ${unlocked ? '' : 'locked'}">
      <div class="roundel"><div class="fill" style="--h:${m}%;--i:${i}"></div><span class="initial">${e.initial}</span></div>
      <button class="era-card" data-era="${e.id}" ${unlocked ? '' : 'disabled'}>
        <div class="era-top"><h3>${esc(e.name)}</h3><span class="pct">${unlocked ? m + '%' : 'locked'}</span></div>
        <div class="meta">${esc(e.span)} — ${esc(e.blurb)}</div>
        ${unlocked ? bar(m) : ''}
        <div class="books">${bookNames.slice(0, 6).join(' · ')}${bookNames.length > 6 ? ' · +' + (bookNames.length - 6) : ''}</div>
      </button></div>`;
  }).join('');

  app().innerHTML = `
    <div class="eyebrow">Bible Quest</div>
    <h1 class="page-h">The Complete Scripture Journey</h1>
    <p class="lede">Seventeen stages from Genesis to Revelation. Each roundel fills with gold as you actually retain the material — not as you click through it.</p>
    <div class="grid g4" style="margin-top:22px">
      <div class="stat"><div class="k">Overall mastery</div><div class="v">${om}<small>%</small></div>${bar(om)}</div>
      <div class="stat"><div class="k">Old Testament</div><div class="v">${testamentMastery('OT')}<small>%</small></div>${bar(testamentMastery('OT'))}</div>
      <div class="stat"><div class="k">New Testament</div><div class="v">${testamentMastery('NT')}<small>%</small></div>${bar(testamentMastery('NT'))}</div>
      <div class="stat"><div class="k">Day streak</div><div class="v">${S.streak.count || 0}</div><div class="meta" style="font-family:var(--ui);font-size:11px;color:var(--muted);margin-top:6px">Best ${S.streak.best || 0}</div></div>
    </div>
    <div class="sec-h">The road</div>
    <div class="spine">${rows}</div>`;
}

function viewEra(eid) {
  const e = E_BY_ID[eid]; if (!e) return go('journey');
  const ids = conceptsInEra(eid), m = eraMastery(eid), er = eraRec(eid);
  const books = e.books.map(b => B_BY_ID[b]).filter(Boolean);
  const list = ids.map(id => {
    const c = C_BY_ID[id], lv = conceptLevel(id), cm = conceptMastery(id);
    return `<button class="bookrow" data-concept="${id}">
      <div><div class="nm">${esc(c.topic)}</div><div class="sm">${esc(c.ref)} · ${LEVEL_NAMES[lv]}</div></div>
      <div>${bar(cm)}</div><div class="pc">${cm}%</div></button>`;
  }).join('');

  app().innerHTML = `
    <div class="crumb"><button data-go="journey">Journey</button> / ${esc(e.name)}</div>
    <h1 class="page-h">${esc(e.name)}</h1>
    <p class="lede">${esc(e.blurb)}</p>
    <div class="grid g3" style="margin-top:20px">
      <div class="stat"><div class="k">Stage mastery</div><div class="v">${m}<small>%</small></div>${bar(m)}</div>
      <div class="stat"><div class="k">Boss battle</div><div class="v">${er.passed ? 'Passed' : er.attempts ? er.best + '%' : '—'}</div>
        <div class="k" style="margin-top:6px">${e.boss} questions · ${PASS_MARK}% to pass</div></div>
      <div class="stat"><div class="k">Concepts</div><div class="v">${ids.length}</div>
        <div class="k" style="margin-top:6px">${ids.filter(i => conceptLevel(i) === 5).length} mastered</div></div>
    </div>
    <div class="btnrow">
      <button class="btn solid" data-quiz="era:${eid}">Study quiz (10)</button>
      <button class="btn" data-quiz="understanding:${eid}">Understanding test (8)</button>
      <button class="btn red" data-quiz="boss:${eid}">Boss battle (${e.boss})</button>
    </div>
    <div class="sec-h">Books in this stage</div>
    <div>${books.map(b => `<button class="bookrow" data-book="${b.id}">
      <div><div class="nm">${esc(b.name)}</div><div class="sm">${b.ch} chapter${b.ch === 1 ? '' : 's'} · ${esc(b.genre)}</div></div>
      <div>${bar(bookProgress(b.id).pct)}</div><div class="pc">${bookProgress(b.id).pct}%</div></button>`).join('')}</div>
    <div class="sec-h">Concepts</div>
    <div>${list || '<div class="empty">No concepts loaded for this stage yet.</div>'}</div>`;
}

/* ================================ BOOKS ================================ */
let bookFilter = 'all';
function viewBooks() {
  const filters = [['all', 'All 66'], ['OT', 'Old Testament'], ['NT', 'New Testament'],
    ['Law', 'Law'], ['History', 'History'], ['Wisdom', 'Wisdom'], ['Prophecy', 'Prophecy'], ['Gospel', 'Gospels'], ['Letter', 'Letters']];
  const shown = BOOKS.filter(b => bookFilter === 'all' ? true :
    (bookFilter === 'OT' || bookFilter === 'NT') ? b.t === bookFilter : b.genre.includes(bookFilter));
  app().innerHTML = `
    <div class="eyebrow">Library</div>
    <h1 class="page-h">The 66 Books</h1>
    <p class="lede">Every book has its own page. A book is only marked complete after six separate gates are passed — reading the overview is one of them.</p>
    <div class="filters">${filters.map(([k, n]) => `<button class="chip ${bookFilter === k ? 'on' : ''}" data-filter="${k}">${n}</button>`).join('')}</div>
    <div style="margin-top:14px">${shown.map(b => {
      const p = bookProgress(b.id);
      return `<button class="bookrow" data-book="${b.id}">
        <div><div class="nm">${esc(b.name)} ${p.complete ? '<span style="color:var(--gold)">✦</span>' : ''}</div>
        <div class="sm">${b.t === 'OT' ? 'Old Testament' : 'New Testament'} · ${b.ch} ch · ${esc(b.genre)}</div></div>
        <div>${bar(p.pct)}</div><div class="pc">${p.pct}%</div></button>`;
    }).join('')}</div>`;
}

function viewBook(bid) {
  const b = B_BY_ID[bid]; if (!b) return go('books');
  markBookGate(bid, 'lessons');
  const p = bookProgress(bid), ids = conceptsInBook(bid);
  const gate = (k, label, hint) => {
    const on = bookRec(bid)[k];
    return `<div class="check ${on ? 'done' : ''}"><span class="box">${on ? '✓' : ''}</span><span>${label}<span style="color:var(--muted)"> — ${hint}</span></span></div>`;
  };
  const section = (title, items) => items && items.length ? `<div class="lesson"><h4>${title}</h4><div class="taglist">${items.map(i => `<span class="pill">${esc(i)}</span>`).join('')}</div></div>` : '';

  app().innerHTML = `
    <div class="crumb"><button data-go="books">Books</button> / ${esc(b.name)}</div>
    <h1 class="page-h">${esc(b.name)}</h1>
    <p class="lede">${b.t === 'OT' ? 'Old Testament' : 'New Testament'} · ${b.ch} chapter${b.ch === 1 ? '' : 's'} · ${esc(b.genre)}</p>
    <div class="grid g2" style="margin-top:20px">
      <div class="vellum">
        <div class="eyebrow">Overview</div>
        <p style="margin:8px 0 14px">${esc(b.overview)}</p>
        <div class="eyebrow">Historical setting</div>
        <p style="margin:8px 0 0">${esc(b.setting)}</p>
      </div>
      <div class="panel">
        <div class="eyebrow">Book mastery</div>
        <div style="font-family:var(--display);font-size:34px;color:var(--gold-lt);margin:6px 0">${p.pct}%</div>
        ${bar(p.pct, 'lg')}
        <div class="checklist" style="margin-top:16px">
          ${gate('lessons', 'Lessons opened', 'read this page')}
          ${gate('quiz', 'Basic quiz passed', '70% or better')}
          ${gate('timeline', 'Timeline test passed', 'sequence questions')}
          ${gate('character', 'Character test passed', 'people questions')}
          ${gate('connection', 'Connection test passed', 'links to other books')}
          ${gate('mastery', 'Mastery test passed', '85% on mixed formats')}
        </div>
        <div class="legend"><span>Complete needs all six gates and 75% concept mastery.</span></div>
      </div>
    </div>
    ${section('Major people', b.people)}
    ${section('Major events', b.events)}
    ${section('Major themes', b.themes)}
    ${section('Important locations', b.places)}
    <div class="lesson"><h4>Important connections</h4>
      <ul style="margin:6px 0 0;padding-left:18px;color:#D2D5EA">${b.connections.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
    ${ids.length ? `<div class="sec-h">Key concepts</div>
      <div>${ids.map(id => {
        const c = C_BY_ID[id];
        return `<button class="bookrow" data-concept="${id}">
          <div><div class="nm">${esc(c.topic)}</div><div class="sm">${esc(c.ref)} · ${LEVEL_NAMES[conceptLevel(id)]}</div></div>
          <div>${bar(conceptMastery(id))}</div><div class="pc">${conceptMastery(id)}%</div></button>`;
      }).join('')}</div>` : `<div class="sec-h">Key concepts</div>
      <div class="empty">Detailed concept drills for ${esc(b.name)} are not in this build yet. The overview, themes and connections above still count toward the first gate, and the book\u2019s content is already wired into the era quizzes.</div>`}
    <div class="sec-h">Tests for this book</div>
    <div class="btnrow">
      <button class="btn solid" data-quiz="book:${bid}:quiz">Basic quiz</button>
      <button class="btn" data-quiz="book:${bid}:timeline">Timeline test</button>
      <button class="btn" data-quiz="book:${bid}:character">Character test</button>
      <button class="btn" data-quiz="book:${bid}:connection">Connection test</button>
      <button class="btn red" data-quiz="book:${bid}:mastery">Mastery test</button>
    </div>`;
}

/* ============================ CONCEPT DETAIL ============================ */
function viewConcept(id) {
  const c = C_BY_ID[id]; if (!c) return go('journey');
  const r = S.c[id], lv = conceptLevel(id), m = conceptMastery(id), cf = confidence(id);
  const typeRows = Object.keys(TYPE_NAMES).filter(t => c.p.some(p => p.t === t)).map(t => {
    const rr = r && r.types[t];
    return `<div class="diagrow"><span class="dot ${rr && rr.right ? 'grn' : rr ? 'red' : 'yel'}"></span>
      <div><div class="t">${TYPE_NAMES[t]}</div><div class="s">${rr ? rr.right + ' right, ' + rr.wrong + ' wrong' : 'not yet attempted'}</div></div>
      <div class="r">${c.p.filter(p => p.t === t).length} probe${c.p.filter(p => p.t === t).length === 1 ? '' : 's'}</div></div>`;
  }).join('');

  app().innerHTML = `
    <div class="crumb"><button data-go="journey">Journey</button> / <button data-era-go="${c.e}">${esc(E_BY_ID[c.e].name)}</button> / ${esc(c.topic)}</div>
    <h1 class="page-h">${esc(c.topic)}</h1>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
      ${claimTag(c.claim)}<span class="ref">${esc(c.ref)}</span>
      <span class="pill g">${esc(B_BY_ID[c.b].name)}</span>
    </div>
    <div class="vellum"><p style="margin:0">${esc(c.sum)}</p></div>
    <div class="grid g3" style="margin-top:14px">
      <div class="stat"><div class="k">Mastery</div><div class="v">${m}<small>%</small></div>${bar(m)}</div>
      <div class="stat"><div class="k">Knowledge level</div><div class="v" style="font-size:19px">${LEVEL_NAMES[lv]}</div><div style="margin-top:8px">${lvlDots(lv)}</div></div>
      <div class="stat"><div class="k">Confidence</div><div class="v" style="font-size:19px">${cf.label}</div>
        <div class="k" style="margin-top:6px">${r ? 'Returns ' + fmtWhen(r.next) : 'not yet studied'}</div></div>
    </div>
    <div class="sec-h">How it has been tested</div>
    <div class="diag">${typeRows}</div>
    <div class="btnrow"><button class="btn solid" data-quiz="concept:${id}">Drill this concept</button>
      <button class="btn ghost" data-book="${c.b}">Open ${esc(B_BY_ID[c.b].name)}</button></div>`;
}

/* ============================== QUIZ RUNNER ============================== */
let Q = null;

function startQuiz(spec) {
  const [kind, a, b] = spec.split(':');
  let list = [], title = '', sub = '', pass = 70, onPass = null;

  if (kind === 'era') { list = buildQuiz(conceptsInEra(a), 10, {}); title = E_BY_ID[a].name + ' study quiz'; sub = 'Mixed formats drawn from this stage'; }
  else if (kind === 'understanding') {
    list = buildQuiz(conceptsInEra(a), 8, { minLevel: 3 });
    title = E_BY_ID[a].name + ' understanding test';
    sub = 'Sequence, cause, connection and book knowledge — not simple recall'; pass = 75;
  }
  else if (kind === 'boss') {
    list = bossQuiz(a); title = E_BY_ID[a].name.toUpperCase() + ' BOSS BATTLE';
    sub = 'Pulls from this stage and everything before it'; pass = PASS_MARK;
    onPass = score => {
      const er = eraRec(a); er.attempts++; er.best = Math.max(er.best, score);
      if (score >= PASS_MARK) er.passed = true; saveState();
    };
  }
  else if (kind === 'book') {
    const ids = conceptsInBook(a);
    const pool = ids.length ? ids : conceptsInEra((B_BY_ID[a].eras || ['creation'])[0]);
    const maps = {
      quiz: { n: 8, o: {}, t: 'Basic quiz', p: 70 },
      timeline: { n: 6, o: { types: ['ord', 'nxt', 'cse'] }, t: 'Timeline test', p: 70 },
      character: { n: 6, o: { types: ['who', 'mat', 'mc'] }, t: 'Character test', p: 70 },
      connection: { n: 6, o: { types: ['con', 'bok', 'scn'] }, t: 'Connection test', p: 70 },
      mastery: { n: 10, o: { minLevel: 3 }, t: 'Mastery test', p: 85 }
    };
    const cfg = maps[b];
    list = buildQuiz(pool, cfg.n, cfg.o); title = B_BY_ID[a].name + ' — ' + cfg.t;
    sub = 'Gate ' + (b === 'quiz' ? 'two' : b === 'timeline' ? 'three' : b === 'character' ? 'four' : b === 'connection' ? 'five' : 'six') + ' of six for this book';
    pass = cfg.p;
    onPass = score => { if (score >= cfg.p) markBookGate(a, b); };
  }
  else if (kind === 'concept') { list = buildQuiz([a], Math.min(4, C_BY_ID[a].p.length), {}); title = C_BY_ID[a].topic; sub = 'Focused drill'; }
  else if (kind === 'daily') { list = buildQuiz(dailySet(), 10, {}); title = 'Daily scripture challenge'; sub = '5 revisited · 3 weak · 2 new'; onPass = () => { S.daily[new Date().toDateString()] = true; saveState(); }; }
  else if (kind === 'review') { const w = reviewQueue(20).map(x => x.id); list = buildQuiz(w, Math.min(10, Math.max(4, w.length)), {}); title = 'Review quest'; sub = 'Built from what you have been getting wrong'; }
  else if (kind === 'transfer') { list = transferQuiz(seenConcepts(), 12); title = 'Do I really know this?'; sub = 'Questions you have never been asked before'; pass = 75; }
  else if (kind === 'final') { list = finalExamQuiz(); title = 'The Ultimate Bible Mastery Exam'; sub = '100 questions across the whole Bible'; pass = PASS_MARK;
    onPass = score => { S.exams.final = { best: Math.max(score, (S.exams.final || {}).best || 0), passed: score >= PASS_MARK || !!(S.exams.final || {}).passed }; saveState(); }; }
  else if (kind === 'master') { list = masterChallengeQuiz(); title = 'The Scripture Master Challenge'; sub = 'Cross-book reasoning only'; pass = 85;
    onPass = score => { S.exams.master = { best: Math.max(score, (S.exams.master || {}).best || 0), passed: score >= 85 || !!(S.exams.master || {}).passed }; saveState(); }; }

  if (!list.length) { toast('Not enough studied material yet for that test — explore a stage first.'); return; }
  Q = { list, i: 0, results: [], title, sub, pass, onPass, answered: false, state: null };
  VIEW = { name: 'quiz', arg: spec };
  window.scrollTo(0, 0);
  render();
}

function renderQuiz() {
  if (Q.i >= Q.list.length) return renderResults();
  const item = Q.list[Q.i], p = item.p, c = C_BY_ID[item.cid];
  const pct = Math.round((Q.i / Q.list.length) * 100);
  let body = '';

  if (p.t === 'ord') {
    if (!Q.state) Q.state = shuffle(p.it.slice());
    body = `<div class="ordlist" id="ord">${Q.state.map((t, i) => `<div class="ord" draggable="true" data-i="${i}">
        <span class="n"></span><span>${esc(t)}</span>
        <span class="arrows"><button data-mv="${i}:-1" aria-label="Move up">▲</button><button data-mv="${i}:1" aria-label="Move down">▼</button></span>
      </div>`).join('')}</div>
      <div class="btnrow"><button class="btn solid" id="submit">Lock in this order</button></div>`;
  } else if (p.t === 'mat') {
    if (!Q.state) Q.state = { pairs: {}, sel: null, rights: shuffle(p.pr.map(x => x[1])) };
    const st = Q.state;
    body = `<div class="matchgrid">
      <div class="matchcol">${p.pr.map(([l], i) => `<button class="mitem ${st.sel === l ? 'sel' : ''} ${st.pairs[l] ? 'paired' : ''}" data-left="${esc(l)}">
        <span class="num">${i + 1}</span>${esc(l)}${st.pairs[l] ? `<div style="color:var(--gold-lt);font-size:12px;margin-top:6px">→ ${esc(st.pairs[l])}</div>` : ''}</button>`).join('')}</div>
      <div class="matchcol">${st.rights.map(rv => {
        const taken = Object.values(st.pairs).includes(rv);
        return `<button class="mitem ${taken ? 'paired' : ''}" data-right="${esc(rv)}" ${taken ? 'disabled' : ''}>${esc(rv)}</button>`;
      }).join('')}</div></div>
      <div class="btnrow"><button class="btn solid" id="submit" ${Object.keys(st.pairs).length === p.pr.length ? '' : 'disabled'}>Check matches</button>
      <button class="btn ghost" id="clear">Clear</button></div>`;
  } else if (p.t === 'exp') {
    body = `<textarea class="explain" id="expbox" placeholder="Write your answer in your own words. There is no word count — the point is whether you can say it yourself."></textarea>
      <div class="btnrow"><button class="btn solid" id="submit">Compare with a model answer</button></div>`;
  } else {
    const cluesHtml = p.t === 'who' ? `<ul class="clues">${p.clues.map(cl => `<li>${esc(cl)}</li>`).join('')}</ul>` : '';
    body = cluesHtml + `<div class="opts">${p.o.map((o, i) =>
      `<button class="opt" data-opt="${i}"><span class="ltr">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
  }

  app().innerHTML = `<div class="quizwrap">
    <div class="qhead">
      <div><div class="qmeta">${esc(Q.title)}</div><div class="qmeta" style="color:var(--gold-dim)">${esc(Q.sub)}</div></div>
      <div style="display:flex;gap:10px;align-items:center">
        <span class="qtype">${TYPE_NAMES[p.t]}</span>
        <span class="qmeta">${Q.i + 1} / ${Q.list.length}</span>
      </div>
    </div>
    <div class="qbar"><i style="width:${pct}%"></i></div>
    <div class="qtext">${esc(p.t === 'who' ? 'Who am I?' : p.q)}</div>
    ${body}
    <div id="fb"></div>
    <div class="btnrow" style="justify-content:space-between">
      <button class="btn ghost sm" id="quit">Leave test</button>
      <span class="qmeta">${esc(c.topic)}</span>
    </div></div>`;
}

function showFeedback(correct, item, extra) {
  const p = item.p, c = C_BY_ID[item.cid], r = S.c[item.cid];
  const fb = document.getElementById('fb');
  fb.innerHTML = `<div class="feedback ${correct === 'right' ? 'ok' : correct === 'partial' ? 'ok' : 'no'}">
    <div class="fh">${correct === 'right' ? 'Correct' : correct === 'partial' ? 'Partly there' : 'Not quite'}</div>
    <div class="why">${extra || esc(p.w || '')}</div>
    <div class="foot">${claimTag(c.claim)}<span class="ref">${esc(c.ref)}</span>
      <span>Level now: ${LEVEL_NAMES[conceptLevel(item.cid)]} · ${conceptMastery(item.cid)}%</span>
      <span>Returns ${fmtWhen(r ? r.next : 0)}</span></div>
  </div>
  <div class="btnrow"><button class="btn solid" id="next">${Q.i + 1 >= Q.list.length ? 'See results' : 'Next question'}</button>
  <button class="btn ghost" data-concept="${item.cid}">About this concept</button></div>`;
  fb.querySelector('#next').onclick = nextQuestion;
  const link = fb.querySelector('[data-concept]');
  if (link) link.onclick = () => { Q = null; go('concept', item.cid); };
  fb.querySelector('#next').focus();
}

function answer(result, item, extra) {
  if (Q.answered) return;
  Q.answered = true;
  recordAnswer(item.cid, item.i, result);
  Q.results.push({ cid: item.cid, i: item.i, t: item.p.t, result });
  showFeedback(result, item, extra);
}

function nextQuestion() {
  Q.i++; Q.answered = false; Q.state = null;
  render();
}

function renderResults() {
  const total = Q.results.length;
  const right = Q.results.filter(r => r.result === 'right').length;
  const partial = Q.results.filter(r => r.result === 'partial').length;
  const score = Math.round(((right + partial * 0.5) / Math.max(1, total)) * 100);
  const passed = score >= Q.pass;
  if (Q.onPass) Q.onPass(score);
  pushLog({ title: Q.title, score });
  celebrate(checkAchievements());

  const missedIds = [...new Set(Q.results.filter(r => r.result !== 'right').map(r => r.cid))];
  const knownIds = [...new Set(Q.results.filter(r => r.result === 'right').map(r => r.cid))].filter(id => !missedIds.includes(id));

  const circ = 2 * Math.PI * 54;
  const ring = `<svg class="score-ring" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="9"/>
    <circle cx="60" cy="60" r="54" fill="none" stroke="${passed ? 'var(--gold)' : 'var(--rubric)'}" stroke-width="9"
      stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - score / 100)}" transform="rotate(-90 60 60)"/>
    <text x="60" y="66" text-anchor="middle" font-family="Cinzel,serif" font-size="26" fill="${passed ? '#EBCE7A' : '#E8A197'}">${score}%</text></svg>`;

  const missRows = missedIds.map(id => {
    const c = C_BY_ID[id], r = S.c[id];
    const wrongTypes = Q.results.filter(x => x.cid === id && x.result !== 'right').map(x => TYPE_NAMES[x.t]);
    return `<div class="diagrow"><span class="dot ${dotFor(conceptMastery(id))}"></span>
      <div><div class="t">${esc(c.topic)}</div>
        <div class="s">Missed on: ${wrongTypes.join(', ')} · ${esc(c.ref)}</div>
        <div class="s" style="color:var(--gold-dim);margin-top:4px">Why it slipped: ${esc(c.sum.slice(0, 130))}${c.sum.length > 130 ? '…' : ''}</div></div>
      <div class="r">${conceptMastery(id)}%<br>returns ${fmtWhen(r.next)}</div></div>`;
  }).join('');

  const knowRows = knownIds.slice(0, 10).map(id => {
    const c = C_BY_ID[id];
    return `<div class="diagrow"><span class="dot grn"></span>
      <div><div class="t">${esc(c.topic)}</div><div class="s">${LEVEL_NAMES[conceptLevel(id)]} · ${esc(c.ref)}</div></div>
      <div class="r">${conceptMastery(id)}%</div></div>`;
  }).join('');

  app().innerHTML = `<div class="quizwrap">
    <div class="eyebrow">${passed ? 'Passed' : 'Not yet'}</div>
    <h1 class="page-h" style="font-size:28px">${esc(Q.title)}</h1>
    <div class="result-top" style="margin:20px 0">
      ${ring}
      <div style="flex:1;min-width:220px">
        <div class="kv">
          <dt>Score</dt><dd>${right} correct${partial ? ', ' + partial + ' partial' : ''} of ${total}</dd>
          <dt>Needed</dt><dd>${Q.pass}%</dd>
          <dt>Verdict</dt><dd>${passed ? 'Passed. This stage is unlocked and the concepts are scheduled to return.' : 'Not yet. Nothing is lost — the misses below are queued to come back in new formats.'}</dd>
        </div>
      </div>
    </div>
    ${knowRows ? `<div class="sec-h">What you know</div><div class="diag">${knowRows}</div>` : ''}
    ${missRows ? `<div class="sec-h">What you missed, and when it returns</div><div class="diag">${missRows}</div>` : '<div class="sec-h">What you missed</div><div class="empty">Nothing missed in this test.</div>'}
    <div class="btnrow">
      ${missedIds.length ? `<button class="btn solid" data-quiz="review">Start review quest on these</button>` : ''}
      <button class="btn ghost" data-go="journey">Back to the journey</button>
      <button class="btn ghost" data-go="dashboard">Dashboard</button>
    </div></div>`;
}

/* =============================== TIMELINE =============================== */
let tlChallenge = null;
function viewTimeline() {
  if (tlChallenge) return renderTlChallenge();
  const rows = TIMELINE.map((t, i) => {
    const seen = ALL_CONCEPTS.some(c => c.e === t.era && S.c[c.id] && S.c[c.id].seen);
    return `<div class="tlitem ${seen ? 'seen' : ''}">
      <div class="yr">${esc(t.date)} · ${esc(E_BY_ID[t.era] ? E_BY_ID[t.era].name : '')}</div>
      <div class="ev">${esc(t.n)}</div>
      <div class="ds">${esc(t.d)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:7px">
        ${claimTag(t.claim)}<span class="ref">${esc(t.ref)}</span></div>
      ${t.note ? `<div class="rubric" style="margin-top:8px">${esc(t.note)}</div>` : ''}
    </div>`;
  }).join('');
  app().innerHTML = `
    <div class="eyebrow">Chronology</div>
    <h1 class="page-h">The Bible Timeline</h1>
    <p class="lede">Explore the sequence, then prove you can rebuild it. Where dating is genuinely disputed, the entry says so rather than picking a side quietly.</p>
    <div class="btnrow"><button class="btn solid" id="tlgo">Order the events challenge</button></div>
    <div class="sec-h">From creation to Revelation</div>
    <div class="tl">${rows}</div>`;
  document.getElementById('tlgo').onclick = () => { startTlChallenge(); };
}

function startTlChallenge() {
  const start = Math.floor(Math.random() * (TIMELINE.length - 6));
  const slice = TIMELINE.slice(start, start + 6);
  tlChallenge = { correct: slice.map(t => t.n), order: shuffle(slice.map(t => t.n)), done: false, slice };
  render();
}
function renderTlChallenge() {
  const t = tlChallenge;
  app().innerHTML = `<div class="quizwrap">
    <div class="eyebrow">Timeline challenge</div>
    <h1 class="page-h" style="font-size:26px">Put these in order</h1>
    <p class="lede">Earliest at the top. Drag them, or use the arrows.</p>
    <div class="ordlist" id="ord" style="margin-top:18px">${t.order.map((n, i) => {
      const cls = t.done ? (t.order[i] === t.correct[i] ? 'right' : 'wrong') : '';
      return `<div class="ord ${cls}" draggable="${!t.done}" data-i="${i}"><span class="n"></span><span>${esc(n)}</span>
        ${t.done ? '' : `<span class="arrows"><button data-mv="${i}:-1">▲</button><button data-mv="${i}:1">▼</button></span>`}</div>`;
    }).join('')}</div>
    ${t.done ? `<div class="feedback ${t.score === 6 ? 'ok' : 'no'}"><div class="fh">${t.score} of 6 in the right place</div>
      <div class="why">Correct order: ${t.correct.map((c, i) => (i + 1) + '. ' + esc(c)).join(' &nbsp; ')}</div></div>` : ''}
    <div class="btnrow">
      ${t.done ? `<button class="btn solid" id="again">Another set</button><button class="btn ghost" id="back">Back to the timeline</button>`
        : `<button class="btn solid" id="submit">Check my order</button><button class="btn ghost" id="back">Leave</button>`}
    </div></div>`;
  bindOrdering(() => { render(); });
  const sb = document.getElementById('submit');
  if (sb) sb.onclick = () => {
    t.score = t.order.filter((n, i) => n === t.correct[i]).length;
    t.done = true;
    if (t.score === 6) { S.timelineMastered = true; saveState(); celebrate(checkAchievements()); }
    render();
  };
  const ag = document.getElementById('again'); if (ag) ag.onclick = () => startTlChallenge();
  const bk = document.getElementById('back'); if (bk) bk.onclick = () => { tlChallenge = null; render(); };
}

/* ================================= MAP ================================= */
let mapSel = null;
let mapRoutes = { j1: true, j2: true, j3: true };
function routePath(r) { return 'M' + r.pts.map(p => p.join(' ')).join(' L '); }
function viewMap() {
  const pins = PLACES.map(p => {
    const visited = S.visited.includes(p.id);
    return `<g class="mp ${mapSel === p.id ? 'on' : ''} ${visited ? 'visited' : ''}" data-place="${p.id}" tabindex="0" role="button" aria-label="${esc(p.n)}">
      <circle class="hit" cx="${p.x}" cy="${p.y}" r="16"/>
      <circle class="pin" cx="${p.x}" cy="${p.y}" r="5"/>
      <text x="${p.x + 9}" y="${p.y + 3.5}">${esc(p.n)}</text></g>`;
  }).join('');
  const routes = ROUTES.filter(r => mapRoutes[r.id]).map(r =>
    `<path class="route ${r.id}" d="${routePath(r)}"><title>${esc(r.n)} — ${esc(r.ref)}</title></path>`).join('');
  const sel = mapSel ? PL_BY_ID[mapSel] : null;

  app().innerHTML = `
    <div class="eyebrow">Geography</div>
    <h1 class="page-h">The Bible Map</h1>
    <p class="lede">A schematic chart, not a survey map — coastlines and positions are stylised and are there to fix relationships in memory. Tap a place to open it; toggle Paul’s journeys below.</p>
    <div class="filters" style="margin-top:14px">${ROUTES.map(r =>
      `<button class="chip rt ${r.id} ${mapRoutes[r.id] ? 'on' : ''}" data-route="${r.id}" aria-pressed="${mapRoutes[r.id]}">${esc(r.n)} · ${esc(r.ref)}</button>`).join('')}</div>
    <div class="mapwrap" style="margin-top:12px">
      <svg viewBox="0 0 1000 570" role="img" aria-label="Schematic map of the biblical world">
        <defs><pattern id="sea" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 Q3.5 4 7 7 T14 7" stroke="rgba(120,150,220,.16)" fill="none" stroke-width="1"/></pattern></defs>
        <rect width="1000" height="570" fill="url(#sea)"/>
        <g class="coast">
          <path d="M60 0 L95 25 Q112 42 126 58 L142 80 Q156 102 174 120 L190 142 Q200 158 191 170 L176 179 Q160 181 150 168 L137 149 Q119 129 104 107 L84 74 Q69 44 54 19 L48 0 Z"/>
          <path d="M150 189 L179 187 L166 211 Z"/>
          <path d="M285 0 Q290 40 300 70 Q310 95 330 110 Q345 122 350 140 Q352 158 342 168 Q350 180 365 186 Q385 190 398 180 Q408 170 404 158 Q416 148 420 132 Q424 116 414 104 Q430 96 448 100 Q460 92 464 60 L466 0 Z"/>
          <path d="M478 0 L472 45 Q462 80 462 100 L448 115 Q460 130 472 140 Q478 155 470 168 Q480 185 500 190 L540 196 Q580 200 615 192 L650 185 Q670 190 678 205 L672 230 Q666 260 668 290 L660 310 Q640 318 618 315 Q600 310 585 318 Q560 328 530 326 L480 330 Q420 334 360 331 L280 328 Q200 326 120 330 L0 326 L0 570 L1000 570 L1000 0 Z"/>
          <path d="M575 228 Q590 220 608 226 Q600 238 580 236 Z"/>
          <path d="M405 230 Q430 222 458 228 Q435 240 405 235 Z"/>
          <circle cx="172" cy="230" r="5"/>
          <circle cx="462" cy="184" r="4"/>
        </g>
        ${[...Array(9)].map((_, i) => `<line x1="0" y1="${i * 63 + 30}" x2="1000" y2="${i * 63 + 30}" stroke="rgba(201,162,39,.07)"/>`).join('')}
        ${[...Array(14)].map((_, i) => `<line x1="${i * 71 + 30}" y1="0" x2="${i * 71 + 30}" y2="570" stroke="rgba(201,162,39,.07)"/>`).join('')}
        <text x="150" y="40" fill="rgba(201,162,39,.45)" font-family="Cinzel,serif" font-size="13" letter-spacing="4">EUROPE</text>
        <text x="524" y="142" fill="rgba(201,162,39,.45)" font-family="Cinzel,serif" font-size="13" letter-spacing="4">ASIA MINOR</text>
        <text x="820" y="150" fill="rgba(201,162,39,.45)" font-family="Cinzel,serif" font-size="13" letter-spacing="4">MESOPOTAMIA</text>
        <text x="540" y="420" fill="rgba(201,162,39,.45)" font-family="Cinzel,serif" font-size="13" letter-spacing="4">EGYPT</text>
        <text x="250" y="260" fill="rgba(140,170,235,.35)" font-family="Cinzel,serif" font-size="12" letter-spacing="5">THE GREAT SEA</text>
        ${routes}
        <rect x="55" y="285" width="275" height="262" fill="rgba(9,12,30,.82)" stroke="rgba(201,162,39,.35)"/>
        <text x="66" y="303" fill="rgba(201,162,39,.7)" font-family="Cinzel,serif" font-size="11" letter-spacing="3">THE LAND — DETAIL</text>
        <g class="inset-geo">
          <path class="inset-sea" d="M55 285 L118 285 Q110 318 112 348 L100 364 Q94 386 98 424 L90 452 Q86 480 94 510 L92 547 L55 547 Z"/>
          <path class="river" d="M218 316 Q225 330 214 342 Q206 348 202 352 M204 364 Q214 380 230 396 Q226 418 234 438 Q228 456 236 468 Q241 478 240 484"/>
          <path class="lake" d="M191 342 Q203 336 213 344 Q217 354 208 361 Q196 364 190 356 Q187 348 191 342 Z"/>
          <path class="lake" d="M233 486 Q243 482 248 492 Q252 508 247 522 Q240 530 234 522 Q229 506 233 486 Z"/>
          <path class="valley" d="M212 316 Q200 350 230 396 Q222 430 236 468 Q232 500 238 528" />
        </g>
        ${pins}
      </svg>
    </div>
    <div class="legend"><span><span style="width:9px;height:9px;border-radius:50%;background:var(--verd);display:inline-block"></span> visited</span>
      <span><span style="width:9px;height:9px;border-radius:50%;background:var(--gold-dim);display:inline-block"></span> not yet opened</span>
      ${ROUTES.filter(r => mapRoutes[r.id]).map(r => `<span><span class="swatch ${r.id}"></span> ${esc(r.n.toLowerCase())}</span>`).join('')}
      <span>${S.visited.length} of ${PLACES.length} explored</span></div>
    ${sel ? `<div class="vellum" style="margin-top:18px">
      <div class="eyebrow">${esc(E_BY_ID[sel.era] ? E_BY_ID[sel.era].name : '')}</div>
      <h2 style="font-size:22px;margin:6px 0 10px">${esc(sel.n)}</h2>
      <p style="margin:0 0 14px">${esc(sel.d)}</p>
      <div class="kv">
        <dt>Events here</dt><dd>${sel.events.map(esc).join(' · ')}</dd>
        <dt>People</dt><dd>${sel.people.map(esc).join(' · ')}</dd>
        <dt>Books</dt><dd>${sel.books.map(b => esc(B_BY_ID[b] ? B_BY_ID[b].name : b)).join(' · ')}</dd>
        <dt>Reference</dt><dd><span class="ref">${esc(sel.ref)}</span></dd>
      </div>
      <div class="btnrow"><button class="btn solid sm" id="placequiz">Test me on this place</button></div>
    </div>` : `<div class="empty" style="margin-top:18px">Select a location to open its people, events and references.</div>`}`;

  app().querySelectorAll('[data-place]').forEach(g => {
    const act = () => { mapSel = g.dataset.place; visitPlace(mapSel); celebrate(checkAchievements()); render(); };
    g.onclick = act;
    g.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); act(); } };
  });
  app().querySelectorAll('[data-route]').forEach(b => b.onclick = () => {
    mapRoutes[b.dataset.route] = !mapRoutes[b.dataset.route]; render();
  });
  const pq = document.getElementById('placequiz');
  if (pq) pq.onclick = () => startPlaceQuiz(sel);
}

function startPlaceQuiz(place) {
  const others = shuffle(PLACES.filter(p => p.id !== place.id)).slice(0, 3);
  const qs = [
    { q: 'Which events are associated with ' + place.n + '?', o: shuffle([place.events[0]].concat(others.map(o => o.events[0]))), a: place.events[0] },
    { q: 'Which person is most associated with ' + place.n + '?', o: shuffle([place.people[0]].concat(others.map(o => o.people[0]))), a: place.people[0] },
    { q: 'Which book covers events at ' + place.n + '?', o: shuffle([B_BY_ID[place.books[0]].name].concat(others.map(o => B_BY_ID[o.books[0]].name))), a: B_BY_ID[place.books[0]].name }
  ];
  runMiniQuiz('Geography — ' + place.n, qs, () => { mapSel = place.id; VIEW = { name: 'map' }; render(); });
}

/* Small self-contained quiz used by the map and people sections. */
let MINI = null;
function runMiniQuiz(title, qs, back) {
  MINI = { title, qs, i: 0, right: 0, answered: false, back };
  VIEW = { name: 'mini' }; window.scrollTo(0, 0); render();
}
function renderMini() {
  const m = MINI;
  if (m.i >= m.qs.length) {
    app().innerHTML = `<div class="quizwrap"><div class="eyebrow">Result</div>
      <h1 class="page-h" style="font-size:26px">${esc(m.title)}</h1>
      <div class="vellum"><p style="margin:0">You answered ${m.right} of ${m.qs.length} correctly.</p></div>
      <div class="btnrow"><button class="btn solid" id="back">Back</button></div></div>`;
    document.getElementById('back').onclick = m.back;
    return;
  }
  const q = m.qs[m.i];
  app().innerHTML = `<div class="quizwrap">
    <div class="qhead"><div class="qmeta">${esc(m.title)}</div><span class="qmeta">${m.i + 1} / ${m.qs.length}</span></div>
    <div class="qbar"><i style="width:${(m.i / m.qs.length) * 100}%"></i></div>
    <div class="qtext">${esc(q.q)}</div>
    <div class="opts">${q.o.map((o, i) => `<button class="opt" data-mini="${i}"><span class="ltr">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>
    <div id="fb"></div></div>`;
  app().querySelectorAll('[data-mini]').forEach(b => b.onclick = () => {
    if (m.answered) return; m.answered = true;
    const chosen = q.o[+b.dataset.mini], ok = chosen === q.a;
    if (ok) m.right++;
    app().querySelectorAll('[data-mini]').forEach((x, i) => {
      x.disabled = true;
      if (q.o[i] === q.a) x.classList.add('right');
      else if (i === +b.dataset.mini) x.classList.add('wrong');
    });
    document.getElementById('fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}"><div class="fh">${ok ? 'Correct' : 'Not quite'}</div>
      <div class="why">${esc(q.a)}</div></div><div class="btnrow"><button class="btn solid" id="next">Next</button></div>`;
    document.getElementById('next').onclick = () => { m.i++; m.answered = false; render(); };
  });
}

/* ================================ PEOPLE ================================ */
function viewPeople() {
  const chain = ['abraham', 'isaac', 'jacob', 'joseph'];
  app().innerHTML = `
    <div class="eyebrow">Character memory</div>
    <h1 class="page-h">People of the Bible</h1>
    <p class="lede">Names are far easier to hold when they sit inside relationships. Open a person to see family, places, books and the events they belong to.</p>
    <div class="panel" style="margin-top:18px">
      <div class="eyebrow">A line worth memorising</div>
      <div class="tree" style="margin-top:10px">${chain.map((id, i) =>
        `${i ? '<span>↓</span>' : ''}<button class="btn ghost sm" data-person="${id}"><b>${esc(P_BY_ID[id].n)}</b></button>`).join('')}</div>
      <div style="font-family:var(--ui);font-size:12px;color:var(--muted);margin-top:10px">Four generations carrying one promise, from Genesis 12 to Genesis 50.</div>
    </div>
    <div class="sec-h">The database — ${S.met.length} of ${PEOPLE.length} studied</div>
    <div class="grid g3">${PEOPLE.map(p => `<button class="pcard" data-person="${p.id}">
      <div class="nm">${esc(p.n)}${S.met.includes(p.id) ? ' <span style="color:var(--gold);font-size:11px">✦</span>' : ''}</div>
      <div class="rl">${esc(p.role)}</div>
      <div class="rl" style="color:var(--muted);margin-top:6px">${esc(E_BY_ID[p.era] ? E_BY_ID[p.era].name : '')}</div>
    </button>`).join('')}</div>`;
}

function viewPerson(id) {
  const p = P_BY_ID[id]; if (!p) return go('people');
  meetPerson(id); celebrate(checkAchievements());
  app().innerHTML = `
    <div class="crumb"><button data-go="people">People</button> / ${esc(p.n)}</div>
    <h1 class="page-h">${esc(p.n)}</h1>
    <p class="lede">${esc(p.role)} · ${esc(E_BY_ID[p.era] ? E_BY_ID[p.era].name : '')}</p>
    <div class="vellum" style="margin-top:16px"><div class="eyebrow">Why they matter</div>
      <p style="margin:8px 0 0;font-size:17px">${esc(p.lesson)}</p></div>
    <div class="panel" style="margin-top:14px"><dl class="kv">
      <dt>Family</dt><dd>${[p.fam.parents.length ? 'Parents: ' + p.fam.parents.join(', ') : '', p.fam.spouse ? 'Spouse: ' + p.fam.spouse : '', p.fam.children.length ? 'Children: ' + p.fam.children.join(', ') : ''].filter(Boolean).map(esc).join(' · ') || 'Not recorded'}</dd>
      <dt>Major events</dt><dd>${p.events.map(esc).join(' · ')}</dd>
      <dt>Locations</dt><dd>${p.places.map(esc).join(' · ')}</dd>
      <dt>Books</dt><dd>${p.books.map(b => esc(B_BY_ID[b] ? B_BY_ID[b].name : b)).join(' · ')}</dd>
      <dt>Reference</dt><dd><span class="ref">${esc(p.ref)}</span></dd>
    </dl></div>
    <div class="btnrow"><button class="btn solid" id="pq">Test me on ${esc(p.n)}</button>
      ${p.books[0] ? `<button class="btn ghost" data-book="${p.books[0]}">Open ${esc(B_BY_ID[p.books[0]].name)}</button>` : ''}</div>`;
  document.getElementById('pq').onclick = () => {
    const others = shuffle(PEOPLE.filter(x => x.id !== id)).slice(0, 3);
    runMiniQuiz('Character test — ' + p.n, [
      { q: 'Which role belongs to ' + p.n + '?', o: shuffle([p.role].concat(others.map(o => o.role))), a: p.role },
      { q: 'Which event belongs to ' + p.n + '?', o: shuffle([p.events[0]].concat(others.map(o => o.events[0]))), a: p.events[0] },
      { q: 'Which place is associated with ' + p.n + '?', o: shuffle([p.places[0]].concat(others.map(o => o.places[0]))), a: p.places[0] }
    ], () => go('person', id));
  };
}

/* ============================ MEMORY PALACE ============================ */
function viewPalace() {
  const rooms = PALACE.map(r => {
    const anchors = r.anchor.filter(a => C_BY_ID[a]);
    const m = anchors.length ? avgMastery(anchors) : 0;
    const open = anchors.some(a => S.c[a] && S.c[a].seen);
    return `<button class="room ${open ? 'open' : 'locked'}" data-room="${r.id}">
      <div class="glyph">${r.glyph}</div><h4>${esc(r.n)}</h4>
      <div class="st">${open ? m + '% recalled' : 'Not yet visited'}</div>
      ${open ? bar(m) : ''}
      <div class="st" style="margin-top:8px;color:var(--gold-dim)">${esc(E_BY_ID[r.era] ? E_BY_ID[r.era].name : '')}</div></button>`;
  }).join('');
  app().innerHTML = `
    <div class="eyebrow">Memory technique</div>
    <h1 class="page-h">The Memory Palace</h1>
    <p class="lede">Thirteen places you walk through in order. Each one holds a scene; the room opens once you have met its material, and stays as a peg to hang the rest on.</p>
    <div class="palace" style="margin-top:20px">${rooms}</div>`;
}
function viewRoom(rid) {
  const r = PALACE.find(x => x.id === rid); if (!r) return go('palace');
  const anchors = r.anchor.filter(a => C_BY_ID[a]);
  app().innerHTML = `
    <div class="crumb"><button data-go="palace">Memory palace</button> / ${esc(r.n)}</div>
    <h1 class="page-h">${r.glyph} ${esc(r.n)}</h1>
    <div class="vellum" style="margin-top:16px"><div class="eyebrow">The scene you store here</div>
      <p style="margin:8px 0 0;font-size:18px;line-height:1.55">${esc(r.memory)}</p></div>
    <div class="sec-h">What is stored in this room</div>
    <div>${anchors.map(a => {
      const c = C_BY_ID[a];
      return `<button class="bookrow" data-concept="${a}">
        <div><div class="nm">${esc(c.topic)}</div><div class="sm">${esc(c.ref)}</div></div>
        <div>${bar(conceptMastery(a))}</div><div class="pc">${conceptMastery(a)}%</div></button>`;
    }).join('')}</div>
    <div class="btnrow"><button class="btn solid" data-quiz="room:${rid}">Walk this room (quiz)</button></div>`;
}

/* ========================== DAILY / REVIEW / EXAMS ========================== */
function viewDaily() {
  const set = dailySet(), done = dailyDone();
  const groups = [
    ['Revisited', set.slice(0, 5)], ['Weak spots', set.slice(5, 8)], ['New today', set.slice(8, 10)]
  ];
  app().innerHTML = `
    <div class="eyebrow">Daily</div>
    <h1 class="page-h">Daily Scripture Challenge</h1>
    <p class="lede">Five concepts you have met before, three you keep getting wrong, and two you have never seen. Ten questions, every day.</p>
    <div class="grid g3" style="margin-top:20px">
      <div class="stat"><div class="k">Current streak</div><div class="v">${S.streak.count || 0}</div></div>
      <div class="stat"><div class="k">Best streak</div><div class="v">${S.streak.best || 0}</div></div>
      <div class="stat"><div class="k">Today</div><div class="v" style="font-size:19px">${done ? 'Complete' : 'Waiting'}</div></div>
    </div>
    <div class="btnrow"><button class="btn solid" data-quiz="daily">${done ? 'Practise again' : 'Start today\u2019s ten'}</button></div>
    ${groups.map(([n, ids]) => ids.length ? `<div class="sec-h">${n}</div><div class="diag">${ids.map(id => {
      const c = C_BY_ID[id];
      return `<div class="diagrow"><span class="dot ${dotFor(conceptMastery(id))}"></span>
        <div><div class="t">${esc(c.topic)}</div><div class="s">${esc(c.ref)}</div></div>
        <div class="r">${S.c[id] ? conceptMastery(id) + '%' : 'new'}</div></div>`;
    }).join('')}</div>` : '').join('')}`;
}

function viewReview() {
  const q = reviewQueue(15);
  const rows = q.map(x => {
    const c = C_BY_ID[x.id], m = x.m;
    const light = m < 45 ? '🔴' : m < 75 ? '🟡' : '🟢';
    const word = m < 45 ? 'needs review' : m < 75 ? 'developing' : 'strong';
    return `<div class="diagrow"><span class="dot ${dotFor(m)}"></span>
      <div><div class="t">${light} ${esc(c.topic)} — ${word}</div>
        <div class="s">${esc(c.ref)} · ${LEVEL_NAMES[conceptLevel(x.id)]} · returns ${fmtWhen(S.c[x.id].next)}</div></div>
      <div class="r">${m}%</div></div>`;
  }).join('');
  app().innerHTML = `
    <div class="eyebrow">Personalised</div>
    <h1 class="page-h">Your Review Quest</h1>
    <p class="lede">Built from your actual misses, weighted by how overdue each one is. The same concept comes back in a different format each time.</p>
    ${q.length ? `<div class="btnrow"><button class="btn solid" data-quiz="review">Start the review quest</button></div>
      <div class="sec-h">Queue</div><div class="diag">${rows}</div>`
      : `<div class="empty" style="margin-top:20px">Nothing in the queue yet. Work through a stage on the journey and anything you miss will appear here automatically.</div>
         <div class="btnrow"><button class="btn solid" data-go="journey">Open the journey</button></div>`}`;
}

function viewTransfer() {
  const seen = seenConcepts();
  app().innerHTML = `
    <div class="eyebrow">Transfer test</div>
    <h1 class="page-h">Do I Really Know This?</h1>
    <p class="lede">This test deliberately avoids every question you have already been asked. It reaches for application and connection questions instead — the ones you cannot pass by remembering an answer.</p>
    <div class="vellum" style="margin-top:18px">
      <div class="eyebrow">Why it works this way</div>
      <p style="margin:8px 0 0">Answering the same question correctly twice mostly proves you remember the question. Twelve unseen questions about material you have studied is a much harder and more honest test of whether the understanding transferred.</p>
    </div>
    <div class="btnrow">${seen.length >= 4
      ? `<button class="btn solid" data-quiz="transfer">Begin — 12 unseen questions</button>`
      : `<button class="btn" disabled>Study at least four concepts first</button><button class="btn ghost" data-go="journey">Open the journey</button>`}</div>`;
}

function viewFinal() {
  const om = overallMastery(), bosses = ERAS.filter(e => eraRec(e.id).passed).length;
  const ready = bosses >= 12 || om >= 65;
  const ex = S.exams.final;
  app().innerHTML = `
    <div class="eyebrow">Examination</div>
    <h1 class="page-h">The Ultimate Bible Mastery Exam</h1>
    <p class="lede">One hundred questions across people, events, books, timeline, geography, themes and connections, drawn from both testaments. Questions are chosen from ones you have not already been asked.</p>
    <div class="grid g3" style="margin-top:20px">
      <div class="stat"><div class="k">Boss battles passed</div><div class="v">${bosses}<small>/${ERAS.length}</small></div>${bar((bosses / ERAS.length) * 100)}</div>
      <div class="stat"><div class="k">Overall mastery</div><div class="v">${om}<small>%</small></div>${bar(om)}</div>
      <div class="stat"><div class="k">Best attempt</div><div class="v">${ex ? ex.best + '%' : '—'}</div>
        <div class="k" style="margin-top:6px">${ex && ex.passed ? 'Passed' : 'Pass mark ' + PASS_MARK + '%'}</div></div>
    </div>
    <div class="btnrow">${ready
      ? `<button class="btn solid" data-quiz="final">Sit the exam</button>`
      : `<button class="btn" disabled>Locked</button>`}
      ${ready ? '' : `<span class="qmeta">Unlocks at twelve boss battles passed, or 65% overall mastery.</span>`}</div>
    ${ex && !ex.passed ? `<div class="sec-h">Your study plan</div>${studyPlanHtml()}` : ''}`;
}

function viewMaster() {
  const ex = S.exams.master, unlocked = S.exams.final && S.exams.final.passed;
  app().innerHTML = `
    <div class="eyebrow">Final challenge</div>
    <h1 class="page-h">The Scripture Master Challenge</h1>
    <p class="lede">Forty questions, none of them simple recall. Cross-book connections, timeline reasoning, character relationships, cause and effect, book identification and scenarios. Eighty-five per cent to pass.</p>
    <div class="vellum" style="margin-top:18px"><div class="eyebrow">What it is actually measuring</div>
      <p style="margin:8px 0 0">Whether you can treat the Bible as one connected story rather than a set of separate facts — knowing that Genesis 15:6 turns up in Romans 4, that the Day of Atonement is the argument behind Hebrews 9, and that Joel is what Peter reaches for at Pentecost.</p></div>
    <div class="btnrow">${unlocked
      ? `<button class="btn solid" data-quiz="master">Begin the challenge</button>`
      : `<button class="btn" disabled>Locked until the Final Exam is passed</button>`}
      ${ex ? `<span class="qmeta">Best ${ex.best}%${ex.passed ? ' — passed' : ''}</span>` : ''}</div>`;
}

function studyPlanHtml() {
  const weak = reviewQueue(10);
  if (!weak.length) return '<div class="empty">No weak areas recorded yet.</div>';
  const byEra = {};
  weak.forEach(w => { const e = C_BY_ID[w.id].e; (byEra[e] = byEra[e] || []).push(w); });
  return `<div class="panel"><div class="eyebrow">Personalised plan, ordered by impact</div>
    ${Object.keys(byEra).map((e, i) => `<div class="lesson"><h4>${i + 1}. ${esc(E_BY_ID[e].name)}</h4>
      <p style="margin:4px 0;color:var(--muted);font-size:14px">Return to these before sitting the exam again:</p>
      <div class="taglist">${byEra[e].map(w => `<span class="pill">${esc(C_BY_ID[w.id].topic)} — ${w.m}%</span>`).join('')}</div>
      <div class="btnrow" style="margin-top:10px"><button class="btn sm" data-quiz="era:${e}">Drill this stage</button></div></div>`).join('')}</div>`;
}

/* ============================== DASHBOARD ============================== */
function viewDashboard() {
  const om = overallMastery();
  const mastered = ALL_CONCEPTS.filter(c => conceptLevel(c.id) === 5).length;
  const booksDone = BOOKS.filter(b => bookProgress(b.id).complete).length;
  const weak = reviewQueue(5), strong = strongConcepts(5);
  const levelCounts = [0, 0, 0, 0, 0, 0];
  ALL_CONCEPTS.forEach(c => levelCounts[conceptLevel(c.id)]++);

  app().innerHTML = `
    <div class="eyebrow">Progress</div>
    <h1 class="page-h">Dashboard</h1>
    <p class="lede">What you know, what you understand, what you have mastered, and what still needs work.</p>
    <div class="grid g4" style="margin-top:22px">
      <div class="stat"><div class="k">Overall Bible mastery</div><div class="v">${om}<small>%</small></div>${bar(om)}</div>
      <div class="stat"><div class="k">Old Testament</div><div class="v">${testamentMastery('OT')}<small>%</small></div>${bar(testamentMastery('OT'))}</div>
      <div class="stat"><div class="k">New Testament</div><div class="v">${testamentMastery('NT')}<small>%</small></div>${bar(testamentMastery('NT'))}</div>
      <div class="stat"><div class="k">Books complete</div><div class="v">${booksDone}<small>/66</small></div>${bar((booksDone / 66) * 100)}</div>
      <div class="stat"><div class="k">Concepts mastered</div><div class="v">${mastered}<small>/${ALL_CONCEPTS.length}</small></div></div>
      <div class="stat"><div class="k">People studied</div><div class="v">${S.met.length}<small>/${PEOPLE.length}</small></div></div>
      <div class="stat"><div class="k">Places explored</div><div class="v">${S.visited.length}<small>/${PLACES.length}</small></div></div>
      <div class="stat"><div class="k">Current streak</div><div class="v">${S.streak.count || 0}</div></div>
    </div>

    <div class="sec-h">The five levels of knowledge</div>
    <div class="grid g3">${[1, 2, 3, 4, 5].map(l => `<div class="stat">
      <div class="k">Level ${l} — ${LEVEL_NAMES[l]}</div><div class="v">${levelCounts[l]}</div>
      ${bar((levelCounts[l] / ALL_CONCEPTS.length) * 100)}</div>`).join('')}</div>

    <div class="sec-h">Stage by stage</div>
    <div>${ERAS.map(e => `<button class="bookrow" data-era="${e.id}">
      <div><div class="nm">${esc(e.name)}</div><div class="sm">${eraRec(e.id).passed ? 'Boss battle passed' : eraUnlocked(e.id) ? 'Unlocked' : 'Locked'}</div></div>
      <div>${bar(eraMastery(e.id))}</div><div class="pc">${eraMastery(e.id)}%</div></button>`).join('')}</div>

    <div class="grid g2" style="margin-top:26px">
      <div class="panel"><div class="eyebrow">Weakest topics</div>
        ${weak.length ? `<div class="diag" style="margin-top:10px">${weak.map(w => `<div class="diagrow"><span class="dot ${dotFor(w.m)}"></span>
          <div><div class="t">${esc(C_BY_ID[w.id].topic)}</div><div class="s">${esc(C_BY_ID[w.id].ref)}</div></div>
          <div class="r">${w.m}%</div></div>`).join('')}</div>` : '<div class="empty" style="margin-top:10px">Nothing recorded yet.</div>'}</div>
      <div class="panel"><div class="eyebrow">Strongest topics</div>
        ${strong.length ? `<div class="diag" style="margin-top:10px">${strong.map(w => `<div class="diagrow"><span class="dot grn"></span>
          <div><div class="t">${esc(C_BY_ID[w.id].topic)}</div><div class="s">${LEVEL_NAMES[conceptLevel(w.id)]}</div></div>
          <div class="r">${w.m}%</div></div>`).join('')}</div>` : '<div class="empty" style="margin-top:10px">Nothing recorded yet.</div>'}</div>
    </div>

    ${S.log.length ? `<div class="sec-h">Recent tests</div><div class="diag">${S.log.slice(0, 8).map(l =>
      `<div class="diagrow"><span class="dot ${dotFor(l.score)}"></span><div><div class="t">${esc(l.title)}</div>
      <div class="s">${new Date(l.at).toLocaleString()}</div></div><div class="r">${l.score}%</div></div>`).join('')}</div>` : ''}

    <div class="btnrow"><button class="btn ghost sm" id="reset">Reset all progress</button>
      <span class="qmeta">${memoryOnly ? 'Progress is being kept for this session only.' : 'Progress saves automatically.'}</span></div>`;

  document.getElementById('reset').onclick = () => {
    if (confirm('Reset all progress? Every concept record, book gate and exam result will be cleared.')) {
      wipeState().then(() => { toast('Progress reset.'); go('journey'); });
    }
  };
}

function viewAchievements() {
  app().innerHTML = `
    <div class="eyebrow">Recognition</div>
    <h1 class="page-h">Achievements</h1>
    <p class="lede">${S.ach.length} of ${ACHIEVEMENTS.length} earned. Each one requires demonstrated mastery, not attendance.</p>
    <div class="grid g2" style="margin-top:20px">${ACHIEVEMENTS.map(a => `<div class="ach ${S.ach.includes(a.id) ? 'got' : ''}">
      <div class="em">${a.em}</div><div><div class="nm">${esc(a.n)}</div><div class="ds">${esc(a.d)}</div></div></div>`).join('')}</div>`;
}

function viewAbout() {
  app().innerHTML = `
    <div class="eyebrow">Design notes</div>
    <h1 class="page-h">How This Works</h1>
    <div class="vellum" style="margin-top:18px">
      <div class="eyebrow">The rule this is built on</div>
      <p style="margin:8px 0 0;font-size:17px">A concept is never marked mastered because you answered one question about it. Mastery requires repeated success, in at least four different question formats, across more than one session, with the last three answers all correct.</p>
    </div>
    <div class="sec-h">The five levels</div>
    <div class="grid g2">${[1, 2, 3, 4, 5].map(l => `<div class="panel">
      <div class="eyebrow">Level ${l}</div><h3 style="font-size:17px;color:var(--vellum);margin:6px 0">${LEVEL_NAMES[l]}</h3>
      <p style="margin:0;font-size:14px;color:var(--muted)">${[
        '', 'You have encountered the concept.', 'You can identify it when you see it.',
        'You can explain it or apply it to a situation.',
        'You can link it to other events, people, books and themes.',
        'You have shown it repeatedly, in different formats, over more than one sitting.'][l]}</p></div>`).join('')}</div>

    <div class="sec-h">How repetition is scheduled</div>
    <div class="panel"><p style="margin:0 0 10px">Get something right and it comes back later — ten minutes, then four hours, a day, three days, a week, sixteen days, five weeks. Get it wrong and the interval resets to ten minutes.</p>
      <p style="margin:0">When a concept returns, the question changes. If you first met Noah with "who built the ark", you might next meet him with "why did Noah build the ark", then "what came immediately after the flood", then a sequencing task, then a set of clues to identify him from.</p></div>

    <div class="sec-h">How claims are labelled</div>
    <div class="panel"><p style="margin:0 0 12px">Every concept, timeline entry and answer carries a tag describing what kind of statement it is. This matters in a teaching tool: a reader should always be able to tell a claim the text makes from a reading Christians have drawn from it.</p>
      <div class="taglist">${Object.keys(CLAIM_LABEL).map(k => claimTag(k)).join('')}</div>
      <p style="margin:14px 0 0;font-size:14px;color:var(--muted)">Where Christians genuinely disagree — the dating of the exodus, how to read Revelation\u2019s symbols, how Paul and James fit together — the material says so rather than quietly picking a side. Bible references are given so that anything can be checked in your own Bible. Passages are summarised and explained rather than reproduced.</p></div>

    <div class="sec-h">What is in this build</div>
    <div class="panel"><dl class="kv">
      <dt>Stages</dt><dd>${ERAS.length}, from Creation to Revelation, each ending in a boss battle</dd>
      <dt>Books</dt><dd>All ${BOOKS.length}, each with its own page and six completion gates</dd>
      <dt>Concepts</dt><dd>${ALL_CONCEPTS.length} tracked concepts carrying ${ALL_CONCEPTS.reduce((n, c) => n + c.p.length, 0)} distinct questions</dd>
      <dt>Formats</dt><dd>${Object.keys(TYPE_NAMES).length} question types, including ordering, matching and written explanation</dd>
      <dt>People</dt><dd>${PEOPLE.length} with family, places, books and events</dd>
      <dt>Places</dt><dd>${PLACES.length} on a schematic map</dd>
      <dt>Timeline</dt><dd>${TIMELINE.length} events, with disputed dates flagged</dd>
    </dl>
    <p style="margin:14px 0 0;font-size:14px;color:var(--muted)">Concept drills are deepest in Genesis through the Kings, the Gospels, Acts and the major letters. Books without their own concept set still have full pages and feed the stage quizzes. New concepts can be added to the two concept files without touching any other part of the application — the engine, the dashboard, the exams and the achievements all read from that list.</p></div>`;
}

/* ============================ SHARED BINDINGS ============================ */
function bindOrdering(onChange) {
  const list = document.getElementById('ord');
  if (!list) return;
  const arr = () => (tlChallenge && VIEW.name === 'timeline') ? tlChallenge.order : Q.state;
  list.querySelectorAll('[data-mv]').forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    const [i, d] = b.dataset.mv.split(':').map(Number);
    const a = arr(), j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    onChange();
  });
  let dragFrom = null;
  list.querySelectorAll('.ord').forEach(el => {
    el.ondragstart = e => { dragFrom = +el.dataset.i; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; };
    el.ondragend = () => el.classList.remove('drag');
    el.ondragover = e => { e.preventDefault(); el.classList.add('over'); };
    el.ondragleave = () => el.classList.remove('over');
    el.ondrop = e => {
      e.preventDefault(); el.classList.remove('over');
      const to = +el.dataset.i, a = arr();
      if (dragFrom === null || dragFrom === to) return;
      const [m] = a.splice(dragFrom, 1); a.splice(to, 0, m);
      onChange();
    };
  });
}

function bindQuizInteractions() {
  const item = Q.list[Q.i], p = item.p;
  document.getElementById('quit').onclick = () => { Q = null; go('journey'); };

  if (p.t === 'ord') {
    bindOrdering(() => render());
    document.getElementById('submit').onclick = () => {
      if (Q.answered) return;
      const ok = gradeOrder(p, Q.state);
      document.querySelectorAll('#ord .ord').forEach((el, i) => {
        el.classList.add(Q.state[i] === p.it[i] ? 'right' : 'wrong');
        el.draggable = false;
        el.querySelectorAll('button').forEach(b => b.remove());
      });
      document.getElementById('submit').disabled = true;
      answer(ok ? 'right' : 'wrong', item,
        esc(p.w) + '<br><br><b>Correct order:</b> ' + p.it.map((t, i) => (i + 1) + '. ' + esc(t)).join(' &nbsp; '));
    };
  } else if (p.t === 'mat') {
    const st = Q.state;
    document.querySelectorAll('[data-left]').forEach(b => b.onclick = () => {
      if (Q.answered) return;
      st.sel = b.dataset.left; render();
    });
    document.querySelectorAll('[data-right]').forEach(b => b.onclick = () => {
      if (Q.answered || !st.sel) return;
      st.pairs[st.sel] = b.dataset.right; st.sel = null; render();
    });
    document.getElementById('clear').onclick = () => { st.pairs = {}; st.sel = null; render(); };
    document.getElementById('submit').onclick = () => {
      if (Q.answered) return;
      const ok = gradeMatch(p, st.pairs);
      answer(ok ? 'right' : 'wrong', item,
        esc(p.w) + '<br><br><b>Correct pairs:</b><br>' + p.pr.map(([l, r]) => '• ' + esc(l) + ' → ' + esc(r)).join('<br>'));
    };
  } else if (p.t === 'exp') {
    document.getElementById('submit').onclick = () => {
      if (Q.answered) return;
      const text = document.getElementById('expbox').value;
      const g = gradeExplain(p, text);
      document.getElementById('expbox').disabled = true;
      document.getElementById('submit').disabled = true;
      document.getElementById('fb').innerHTML = `
        <div class="feedback ok"><div class="fh">A model answer</div>
          <div class="why">${esc(p.model)}</div>
          <div class="foot"><span>Ideas you covered: ${g.hits.length} of ${p.keys.length}${g.hits.length ? ' (' + g.hits.map(esc).join(', ') + ')' : ''}</span></div></div>
        <div class="panel" style="margin-top:12px"><div class="eyebrow">Mark yourself honestly — this feeds your mastery score</div>
          <div class="selfrate">
            <button class="btn sm" data-rate="right">I covered the main points</button>
            <button class="btn sm" data-rate="partial">I got some of it</button>
            <button class="btn red sm" data-rate="wrong">I could not explain it</button>
          </div></div>`;
      document.querySelectorAll('[data-rate]').forEach(b => b.onclick = () => {
        const r = b.dataset.rate;
        // A confident self-rating with almost none of the substance is scored down.
        const final = (r === 'right' && g.ratio < 0.25) ? 'partial' : r;
        answer(final, item, esc(p.model));
      });
    };
  } else {
    document.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
      if (Q.answered) return;
      const chosen = +b.dataset.opt, ok = gradeChoice(p, chosen);
      document.querySelectorAll('[data-opt]').forEach((x, i) => {
        x.disabled = true;
        if (i === p.a) x.classList.add('right');
        else if (i === chosen) x.classList.add('wrong');
      });
      answer(ok ? 'right' : 'wrong', item);
    });
  }
}

/* ================================ ROUTER ================================ */
let lastViewKey = null;
function render() {
  renderNav();
  /* Fade only when the screen actually changes — intra-view re-renders
     (filters, matching picks, route toggles) must not flash. */
  const key = VIEW.name + ':' + String(VIEW.arg);
  if (key !== lastViewKey) {
    lastViewKey = key;
    const m = app();
    m.classList.remove('viewfade'); void m.offsetWidth; m.classList.add('viewfade');
  }
  const v = VIEW.name;
  if (v === 'quiz') { renderQuiz(); if (!Q.answered && Q.i < Q.list.length) bindQuizInteractions(); }
  else if (v === 'mini') renderMini();
  else if (v === 'journey') viewJourney();
  else if (v === 'era') viewEra(VIEW.arg);
  else if (v === 'books') viewBooks();
  else if (v === 'book') viewBook(VIEW.arg);
  else if (v === 'concept') viewConcept(VIEW.arg);
  else if (v === 'timeline') viewTimeline();
  else if (v === 'map') viewMap();
  else if (v === 'people') viewPeople();
  else if (v === 'person') viewPerson(VIEW.arg);
  else if (v === 'palace') viewPalace();
  else if (v === 'room') viewRoom(VIEW.arg);
  else if (v === 'daily') viewDaily();
  else if (v === 'review') viewReview();
  else if (v === 'transfer') viewTransfer();
  else if (v === 'final') viewFinal();
  else if (v === 'master') viewMaster();
  else if (v === 'dashboard') viewDashboard();
  else if (v === 'achievements') viewAchievements();
  else if (v === 'about') viewAbout();
  else viewJourney();
  wireDelegates();
}

function wireDelegates() {
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tlChallenge = null; Q = null; go(b.dataset.go); });
  document.querySelectorAll('[data-era]').forEach(b => b.onclick = () => go('era', b.dataset.era));
  document.querySelectorAll('[data-era-go]').forEach(b => b.onclick = () => go('era', b.dataset.eraGo));
  document.querySelectorAll('[data-book]').forEach(b => b.onclick = () => go('book', b.dataset.book));
  document.querySelectorAll('[data-concept]').forEach(b => b.onclick = () => go('concept', b.dataset.concept));
  document.querySelectorAll('[data-person]').forEach(b => b.onclick = () => go('person', b.dataset.person));
  document.querySelectorAll('[data-room]').forEach(b => b.onclick = () => go('room', b.dataset.room));
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { bookFilter = b.dataset.filter; render(); });
  document.querySelectorAll('[data-quiz]').forEach(b => b.onclick = () => {
    const spec = b.dataset.quiz;
    if (spec.startsWith('room:')) {
      const r = PALACE.find(x => x.id === spec.split(':')[1]);
      const ids = r.anchor.filter(a => C_BY_ID[a]);
      const list = buildQuiz(ids, Math.min(8, ids.length * 2), {});
      if (!list.length) return toast('Nothing stored in this room yet.');
      Q = { list, i: 0, results: [], title: r.n, sub: 'Memory palace walk', pass: 70, onPass: null, answered: false, state: null };
      VIEW = { name: 'quiz' }; window.scrollTo(0, 0); render();
      return;
    }
    startQuiz(spec);
  });
  const nx = document.getElementById('next');
  if (nx && VIEW.name === 'quiz') nx.onclick = nextQuestion;
}

/* ================================= BOOT ================================= */
(async function boot() {
  await loadState();
  checkAchievements();
  render();
})();
