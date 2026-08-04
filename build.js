#!/usr/bin/env node
/* Concatenates src/ into a single self-contained dist/bible-quest.html.
   No dependencies, no bundler. Order matters: data before engine before ui. */
const fs = require('fs'), path = require('path');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

const SOURCES = {
  css: ['src/styles.css'],
  js: [
    'src/data/core.js',
    'src/data/concepts-ot.js',
    'src/data/concepts-nt.js',
    'src/engine.js',
    'src/portraits.js',
    'src/ui.js'
  ]
};

const out = [
  read('src/head.html'),
  SOURCES.css.map(read).join('\n'),
  read('src/mid.html'),
  SOURCES.js.map(read).join('\n'),
  read('src/tail.html')
].join('');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/bible-quest.html'), out);
console.log('built dist/bible-quest.html —', (out.length / 1024).toFixed(0) + 'KB');

module.exports = { SOURCES, read };
