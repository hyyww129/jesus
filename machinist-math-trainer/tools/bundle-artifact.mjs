// Bundle the Machinist Math Trainer into ONE self-contained HTML file.
// The hub is the page itself; module pages are embedded as strings and swapped in
// with document.write(). window.name state survives both the swap and reload, so
// unlocking works exactly as it does in the multi-file version.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
// every '<' escaped so no '</script>' can terminate the carrier script
const esc = s => JSON.stringify(s).replace(/</g, '\\u003c');

const STYLE = read('style.css');
const SHARED = read('shared.js');

// every module on disk ships in the bundle
const MODULE_FILES = readdirSync(join(ROOT, 'modules'))
  .filter(f => /^m\d\d-.+\.html$/.test(f)).sort().map(f => 'modules/' + f);

function inline(html, depth) {
  const prefix = depth ? '../' : '';
  html = html.replace('<link rel="stylesheet" href="' + prefix + 'style.css">',
    '<style>\n' + STYLE + '\n</style>');
  html = html.replace('<script src="' + prefix + 'shared.js"></script>',
    '<script>\n' + SHARED + '\n</script>');
  return html;
}

// module docs: inline assets + make the HUB link reload the page (state persists)
const BACK = `
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a') : null;
  if (a && /index\\.html$/.test(a.getAttribute('href') || '')) {
    e.preventDefault(); location.reload();
  }
}, true);
<\/script>`;

const docsJs = MODULE_FILES.map(f => {
  let doc = inline(read(f), true).replace('</body>', BACK + '\n</body>');
  return esc(f) + ': ' + esc(doc);
}).join(',\n');

// hub: inline assets + intercept module links -> document.write the embedded doc
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
    if (href.indexOf('modules/') === 0) {
      e.preventDefault();
      var doc = DOCS[href];
      if (doc) { document.open(); document.write(doc); document.close(); }
    }
  }, true);
})();
<\/script>`;

let hub = inline(read('index.html'), false).replace('</body>', LAUNCH + '\n</body>');

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const OUT = process.argv[2] || join(ROOT, 'dist', 'machinist-math-trainer-standalone.html');
writeFileSync(OUT, hub);
console.log('wrote', OUT, Math.round(hub.length / 1024) + 'KB');
