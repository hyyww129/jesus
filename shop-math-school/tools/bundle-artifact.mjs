// Bundle Shop Math School into ONE self-contained HTML file.
// The skill tree is the page itself; level pages are embedded as strings and
// swapped in with document.write(). window.name state survives both the swap
// and reload, so bosses, unlocks and rank work exactly as in the folder version.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
// every '<' escaped so no '</script>' can terminate the carrier script
const esc = s => JSON.stringify(s).replace(/</g, '\\u003c');

const STYLE = read('style.css');
const SHARED = read('shared.js');

// every level on disk ships in the bundle
const LEVEL_FILES = readdirSync(join(ROOT, 'levels'))
  .filter(f => /^l\d\d-.+\.html$/.test(f)).sort().map(f => 'levels/' + f);

function inline(html, depth) {
  const prefix = depth ? '../' : '';
  // function replacements so '$'-patterns in the payload are never expanded
  html = html.replace('<link rel="stylesheet" href="' + prefix + 'style.css">',
    () => '<style>\n' + STYLE + '\n</style>');
  html = html.replace('<script src="' + prefix + 'shared.js"></script>',
    () => '<script>\n' + SHARED + '\n</script>');
  return html;
}

// level docs: inline assets + make the SKILL TREE link reload the page (state persists)
const BACK = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (a && /index\\.html$/.test(a.getAttribute('href') || '')) {
    e.preventDefault(); location.reload();
  }
}, true);
<\/script>`;

const docsJs = LEVEL_FILES.map(f => {
  let doc = inline(read(f), true).replace('</body>', BACK + '\n</body>');
  return esc(f) + ': ' + esc(doc);
}).join(',\n');

// hub: inline assets + intercept level links -> document.write the embedded doc
const LAUNCH = `
<script>
(function () {
  var DOCS = {
${docsJs}
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('levels/') === 0) {
      e.preventDefault();
      var doc = DOCS[href];
      if (doc) { document.open(); document.write(doc); document.close(); }
    }
  }, true);
})();
<\/script>`;

let hub = inline(read('index.html'), false).replace('</body>', LAUNCH + '\n</body>');

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const OUT = process.argv[2] || join(ROOT, 'dist', 'shop-math-school-standalone.html');
writeFileSync(OUT, hub);
console.log('wrote', OUT, Math.round(hub.length / 1024) + 'KB', '·', LEVEL_FILES.length, 'level(s)');
