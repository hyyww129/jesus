// Bundle dpm3-trainer into ONE self-contained HTML file.
// Hub page holds every game/viewer document as an escaped string; clicking a card
// document.write()s the assembled page (classic scripts only — works from file://).
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(ROOT + '/' + p, 'utf8');

const THREE_SRC = read('model/vendor/three.min.js');
const OC_SRC = read('model/vendor/OrbitControls.js');
// ES module -> classic script inside an IIFE: private names stay private, the
// public API is assigned onto window (document.write keeps the window's global
// scope alive, so leaked top-level let/const would collide across pages).
const MACHINE_SRC =
  '(function(){\n' +
  read('model/machine.js').replace(/^export /gm, '') +
  '\nObject.assign(window, { COLORS, FACTS, rpmFor, feedFor, reportScore, ' +
  'makeScene, buildMachine, DEMO_CYCLES, createCycleRunner });\n})();';

const BACKBAR = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (a && /index\\.html$/.test(a.getAttribute('href') || '')) {
    e.preventDefault(); location.reload();
  }
}, true);
<\/script>`;

function transform(path, needs3d) {
  let html = read(path);
  // drop vendor script tags (paths differ between games/ and model/)
  html = html.replace(/<script src="[^"]*vendor\/(three\.min|OrbitControls)\.js"><\/script>\s*/g, '');
  // module -> classic IIFE, imports -> rely on window globals from machine script
  html = html.replace(/<script type="module">/, '<script>(function(){');
  html = html.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/g, '');
  // after vendor tags are dropped, exactly one literal </script> must remain
  const closes = html.match(/<\/script>/g) || [];
  if (closes.length !== 1) throw new Error(path + ': expected 1 </script>, got ' + closes.length);
  html = html.replace('</script>', '})();</script>');
  // inject libs placeholder right before the main script at end of body
  const marker = needs3d ? '<!--LIBS3D-->' : '<!--LIBS2D-->';
  const idx = html.lastIndexOf('<script>');
  html = html.slice(0, idx) + marker + '\n' + html.slice(idx);
  // back-to-hub = reload the artifact
  html = html.replace('</body>', BACKBAR + '\n</body>');
  return html;
}

const PAGES = [
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

// JSON-escape with every '<' escaped so no '</script>' can appear in the output
const esc = s => JSON.stringify(s).replace(/</g, '\\u003c');

const docsJs = PAGES.map(p => `"${p.id}": ${esc(transform(p.file, p.three))}`).join(',\n');

const hub = read('index.html');
// reuse the hub's ITEMS metadata for cards but with click-to-launch
const bundled = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TRAK DPM3 · Operator Trainer — Standalone</title>
<style>
${hub.match(/<style>([\s\S]*?)<\/style>/)[1]}
  .card a.open { cursor: pointer; }
</style>
</head>
<body>
<header>
  <h1>TRAK DPM3 · PROTOTRAK SMX — OPERATOR TRAINER</h1>
  <span class="sub">BOOT CAMP COMPANION · STANDALONE BUILD</span>
</header>
<div class="note">
  Single-file build — every game and the 3D model in this one page, no server, no
  internet. Open a card to play; the <b>← HUB</b> link inside any game brings you back.
  Scores are memory-only: your paper logbook is the permanent record.
  <b>First real cuts happen with a machinist within arm's reach.</b>
</div>
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
var DOCS = {
${docsJs}
};
var ITEMS = [
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
  out += '<script>' + LIB_MACHINE + HUB_SCRIPT_CLOSE;
  return out;
}
function openGame(id) {
  var doc = DOCS[id]
    .replace("<!--LIBS3D-->", HUB_libsFor(id))
    .replace("<!--LIBS2D-->", HUB_libsFor(id));
  document.open();
  document.write(doc);
  document.close();
}
var cards = document.getElementById('cards');
ITEMS.forEach(function (it) {
  var el = document.createElement('div');
  el.className = 'card' + (it.id === 'viewer' ? ' model' : '');
  el.innerHTML =
    '<div class="top"><span class="num">' + it.num + '</span><span class="day">' + it.day + '</span></div>' +
    '<h2>' + it.title + '</h2><p>' + it.desc + '</p>' +
    '<div class="bottom"><span class="best"></span>' +
    '<a class="open" role="button" tabindex="0">OPEN</a></div>';
  var btn = el.querySelector('a.open');
  btn.addEventListener('click', function () { openGame(it.id); });
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGame(it.id); }
  });
  cards.appendChild(el);
});
</script>
</body>
</html>
`;

const OUT = process.argv[2] || (ROOT + '/dist/dpm3-trainer-standalone.html');
writeFileSync(OUT, bundled);
console.log('wrote', OUT, Math.round(bundled.length / 1024) + 'KB');
