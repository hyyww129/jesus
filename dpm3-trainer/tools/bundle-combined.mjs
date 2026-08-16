// Bundle the DPM3 Operator Trainer AND the Machinist Math Trainer into ONE file:
// a two-section hub — sim games + math curriculum — with every page embedded.
// Pages swap in via document.write; window globals (and window.name state for the
// math side) survive the swap, so navigation and unlocking work everywhere.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const DPM3 = join(dirname(fileURLToPath(import.meta.url)), '..');
const MMT = join(DPM3, '..', 'machinist-math-trainer');
const readD = p => readFileSync(join(DPM3, p), 'utf8');
const readM = p => readFileSync(join(MMT, p), 'utf8');
// every '<' escaped so no '</script>' can terminate the carrier script
const esc = s => JSON.stringify(s).replace(/</g, '\\u003c');

/* ================= DPM3 side (same transform as tools/bundle.mjs) ============ */
const THREE_SRC = readD('model/vendor/three.min.js');
const OC_SRC = readD('model/vendor/OrbitControls.js');
const MACHINE_SRC =
  '(function(){\n' +
  readD('model/machine.js').replace(/^export /gm, '') +
  '\nObject.assign(window, { COLORS, FACTS, rpmFor, feedFor, reportScore, ' +
  'makeScene, buildMachine, DEMO_CYCLES, createCycleRunner });\n})();';

const GAME_BACK = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (a && /index\\.html$/.test(a.getAttribute('href') || '')) {
    e.preventDefault(); location.reload();
  }
}, true);
<\/script>`;

function transformGame(path, needs3d) {
  let html = readD(path);
  html = html.replace(/<script src="[^"]*vendor\/(three\.min|OrbitControls)\.js"><\/script>\s*/g, '');
  html = html.replace(/<script type="module">/, '<script>(function(){');
  html = html.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/g, '');
  const closes = html.match(/<\/script>/g) || [];
  if (closes.length !== 1) throw new Error(path + ': expected 1 </script>, got ' + closes.length);
  html = html.replace('</script>', '})();</script>');
  const marker = needs3d ? '<!--LIBS3D-->' : '<!--LIBS2D-->';
  const idx = html.lastIndexOf('<script>');
  html = html.slice(0, idx) + marker + '\n' + html.slice(idx);
  html = html.replace('</body>', GAME_BACK + '\n</body>');
  return html;
}

const GAME_PAGES = [
  { id: 'viewer', file: 'model/viewer.html', three: true },
  { id: 'g1', file: 'games/g1-name-that-part.html', three: true },
  { id: 'g2', file: 'games/g2-dro-chase.html', three: true },
  { id: 'g3', file: 'games/g3-zero-hunt.html', three: false },
  { id: 'g4', file: 'games/g4-speeds-feeds.html', three: false },
  { id: 'g5', file: 'games/g5-event-builder.html', three: false },
  { id: 'g6', file: 'games/g6-power-up.html', three: false },
  { id: 'g7', file: 'games/g7-ghost-run.html', three: true },
  { id: 'g8', file: 'games/g8-crash-investigator.html', three: false },
  { id: 'g9', file: 'games/g9-dro-brain.html', three: false },
];

/* ================= Math Trainer side ================= */
const MSTYLE = readM('style.css');
const MSHARED = readM('shared.js');
// every math module on disk ships in the bundle
const MMT_MODULES = readdirSync(join(MMT, 'modules'))
  .filter(f => /^m\d\d-.+\.html$/.test(f)).sort().map(f => 'modules/' + f);

function inlineMMT(html, depth) {
  const prefix = depth ? '../' : '';
  return html
    .replace('<link rel="stylesheet" href="' + prefix + 'style.css">', '<style>\n' + MSTYLE + '\n</style>')
    .replace('<script src="' + prefix + 'shared.js"></script>', '<script>\n' + MSHARED + '\n</script>');
}

// module pages: HUB link goes back to the math hub doc (openDoc persists across writes)
const MMT_MOD_NAV = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (a && /index\\.html$/.test(a.getAttribute('href') || '')) {
    e.preventDefault();
    if (window.HUB_openDoc) HUB_openDoc('mmt:index.html'); else location.reload();
  }
}, true);
<\/script>`;

// math hub: module links open embedded docs; a new ALL TRAINERS link goes to the top
const MMT_HUB_NAV = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (!a) return;
  var href = a.getAttribute('href') || '';
  if (href.indexOf('modules/') === 0) {
    e.preventDefault();
    if (window.HUB_openDoc) HUB_openDoc('mmt:' + href); else location.reload();
  }
  if (href === '#alltrainers') { e.preventDefault(); location.reload(); }
}, true);
<\/script>`;

const DOCS = {};
for (const p of GAME_PAGES) DOCS[p.id] = transformGame(p.file, p.three);
DOCS['mmt:index.html'] = inlineMMT(readM('index.html'), false)
  .replace('<div class="eyebrow">', '<a class="hub-link" href="#alltrainers">← ALL TRAINERS</a><div class="eyebrow">')
  .replace('</body>', MMT_HUB_NAV + '\n</body>');
for (const f of MMT_MODULES) {
  DOCS['mmt:' + f] = inlineMMT(readM(f), true).replace('</body>', MMT_MOD_NAV + '\n</body>');
}

const docsJs = Object.keys(DOCS).map(k => esc(k) + ': ' + esc(DOCS[k])).join(',\n');

/* ================= combined hub page ================= */
const hubStyle = readD('index.html').match(/<style>([\s\S]*?)<\/style>/)[1];

const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TRAK DPM3 · Operator Trainer</title>
<style>
${hubStyle}
  .card a.open { cursor: pointer; }
  .section-h {
    font-family: "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace;
    font-size: 12px; letter-spacing: .16em; color: var(--blue);
    border-bottom: 1.5px solid var(--ink); padding: 22px 22px 6px; margin: 0 0 0;
    max-width: 1400px;
  }
  .mathwide {
    margin: 14px 22px; max-width: 900px; border: 1.5px solid var(--ink); background: #fff;
    display: flex; align-items: center; gap: 18px; padding: 14px 16px; flex-wrap: wrap;
  }
  .mathwide .big { font-size: 30px; }
  .mathwide h2 { font-size: 15px; letter-spacing: .04em; }
  .mathwide p { font-size: 12px; color: #47525A; line-height: 1.5; flex: 1; min-width: 240px; }
  .mathwide a.open {
    font-size: 13px; letter-spacing: .1em; text-decoration: none;
    color: var(--paper); background: var(--orange); padding: 10px 22px;
    border: 1.5px solid var(--ink);
  }
  .mathwide a.open:hover, .mathwide a.open:focus-visible { background: var(--blue); }
</style>
</head>
<body>
<header>
  <h1>TRAK DPM3 · PROTOTRAK SMX — OPERATOR TRAINER</h1>
  <span class="sub">SIM GAMES + MATH FROM ZERO · ONE PAGE</span>
</header>
<div class="note">
  Everything in one page: the 3D machine, the nine sim games, and the ground-up math
  curriculum. Open a card to play; <b>← HUB</b> inside a game returns here, and the math
  trainer keeps its own hub with your progress rings — progress lasts until this tab
  closes. <b>First real cuts happen with a machinist within arm's reach.</b>
</div>

<div class="section-h">MATH FROM ZERO — START HERE IF THE NUMBERS FEEL SHAKY</div>
<div class="mathwide">
  <span class="big">📐</span>
  <div style="flex:2;min-width:220px">
    <h2>MACHINIST MATH TRAINER</h2>
    <p>Ten gated modules from reading a ruler to trig and tolerances. Live equations on
    every number, practice that names your exact mistake, 90% quizzes to unlock the next.</p>
  </div>
  <a class="open" data-doc="mmt:index.html" href="#math" role="button">OPEN</a>
</div>

<div class="section-h">OPERATOR SIM — 3D MODEL &amp; GAMES</div>
<main id="cards"></main>
<footer>
  <span>RPM = SFM × 3.82 ÷ D <b>· cap 4200</b></span>
  <span>FEED = RPM × flutes × chip load</span>
  <span>EDGE FINDER TIP .200 → OFFSET <b>.100</b></span>
  <span>TRAVELS <b>31 / 17 / 23.5</b> · QUILL 5 · NMTB40</span>
  <span>VARI-SPEED: ONLY RUNNING · RANGE: ONLY STOPPED</span>
</footer>
<script>
var LIB_THREE = ${esc(THREE_SRC)};
var LIB_OC = ${esc(OC_SRC)};
var LIB_MACHINE = ${esc(MACHINE_SRC)};
var HUB_DOCS = {
${docsJs}
};
var HUB_ITEMS = [
  { id: 'viewer', num: 'MODEL', day: 'DAY 0+', title: '3D Machine Model',
    desc: 'The DPM3 in engineering view: orbit it, jog it, run the demo cycles and narrate what every subsystem is doing.' },
  { id: 'g1', num: 'GAME 1', day: 'DAY 1', title: 'Name That Part',
    desc: 'A component lights up, you name it. Target: 100% under 60 seconds, three runs straight.' },
  { id: 'g2', num: 'GAME 2', day: 'DAY 2', title: 'DRO Chase',
    desc: 'Jog to targets on a live DRO — ABS and INC rounds, scored on time and overshoot.' },
  { id: 'g3', num: 'GAME 3', day: 'DAY 2', title: 'Zero Hunt',
    desc: 'Edge-finder work: kiss the edge, then SET the axis with the ±0.1000 offset logic.' },
  { id: 'g4', num: 'GAME 4', day: 'DAY 3', title: 'Speeds & Feeds Trainer',
    desc: 'RPM and IPM from scratch, ±10% credit, worked formulas after every card. Target ≥90%.' },
  { id: 'g5', num: 'GAME 5', day: 'DAY 3–4', title: 'Event Builder',
    desc: 'Assemble POSN / DRILL / BOLT HOLE / MILL / ARC events — comp side and conrad included.' },
  { id: 'g6', num: 'GAME 6', day: 'DAY 1', title: 'Power-Up Sequence',
    desc: 'Order the startup and shutdown checklists from memory; trap cards to the reject bin.' },
  { id: 'g7', num: 'GAME 7', day: 'DAY 4', title: 'Ghost Run',
    desc: 'Watch a cycle run silent, then call the event list in order. Three variants, timed.' },
  { id: 'g8', num: 'GAME 8', day: 'DAY 5–6', title: 'Crash Investigator',
    desc: 'Fifteen incident cards: root cause and prevention. Every explanation is shop-floor real.' },
  { id: 'g9', num: 'GAME 9', day: 'DAY 2', title: 'DRO Brain',
    desc: 'Live edge-finder math: jog toward the face, watch the readout — gap, kick, then the SET value, narrated live.' },
];
var HUB_SCRIPT_CLOSE = '\\u003c/script>';
function HUB_libsFor(id) {
  var three = { viewer: 1, g1: 1, g2: 1, g7: 1 }[id];
  var out = '';
  if (three) {
    out += '<script>' + LIB_THREE + HUB_SCRIPT_CLOSE;
    out += '<script>' + LIB_OC + HUB_SCRIPT_CLOSE;
  }
  if (id.indexOf('mmt:') !== 0) out += '<script>' + LIB_MACHINE + HUB_SCRIPT_CLOSE;
  return out;
}
function HUB_openDoc(id) {
  var doc = HUB_DOCS[id];
  if (!doc) return;
  doc = doc.replace('<!--LIBS3D-->', HUB_libsFor(id)).replace('<!--LIBS2D-->', HUB_libsFor(id));
  document.open();
  document.write(doc);
  document.close();
}
window.HUB_openDoc = HUB_openDoc;
document.querySelector('.mathwide a.open').addEventListener('click', function (e) {
  e.preventDefault(); HUB_openDoc(this.dataset.doc);
});
var HUB_CARDS = document.getElementById('cards');
HUB_ITEMS.forEach(function (it) {
  var el = document.createElement('div');
  el.className = 'card' + (it.id === 'viewer' ? ' model' : '');
  el.innerHTML =
    '<div class="top"><span class="num">' + it.num + '</span><span class="day">' + it.day + '</span></div>' +
    '<h2>' + it.title + '</h2><p>' + it.desc + '</p>' +
    '<div class="bottom"><span class="best"></span>' +
    '<a class="open" role="button" tabindex="0">OPEN</a></div>';
  var btn = el.querySelector('a.open');
  btn.addEventListener('click', function () { HUB_openDoc(it.id); });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); HUB_openDoc(it.id); }
  });
  HUB_CARDS.appendChild(el);
});
</script>
</body>
</html>
`;

mkdirSync(join(DPM3, 'dist'), { recursive: true });
const OUT = process.argv[2] || join(DPM3, 'dist', 'trak-trainer-all-in-one.html');
writeFileSync(OUT, out);
console.log('wrote', OUT, Math.round(out.length / 1024) + 'KB');
