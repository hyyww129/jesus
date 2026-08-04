/* Loads the game source into the current node process without a bundler.
   Used by every test file. */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const FILES = ['src/data/core.js', 'src/data/concepts-ot.js', 'src/data/concepts-nt.js', 'src/engine.js'];

function stubDom() {
  const El = () => ({
    innerHTML: '', textContent: '', value: '', disabled: false, style: {}, dataset: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    querySelectorAll() { return []; }, querySelector() { return El(); },
    focus() {}, remove() {}, appendChild() {}, onclick: null
  });
  global.document = { getElementById: El, querySelectorAll: () => [], querySelector: El };
  global.confirm = () => false;
  global.setTimeout = () => 0;
  global.clearTimeout = () => {};
}

function load(withUi) {
  global.window = { storage: null, scrollTo() {}, addEventListener() {} };
  if (withUi) stubDom();
  const files = withUi ? FILES.concat('src/ui.js') : FILES;
  const src = files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
  const names = ['ALL_CONCEPTS','BOOKS','ERAS','PEOPLE','PLACES','ROUTES','MAP_DETAIL','TIMELINE','PALACE','ACHIEVEMENTS',
    'C_BY_ID','B_BY_ID','E_BY_ID','PL_BY_ID','ERA_ORDER','S',
    'buildQuiz','bossQuiz','finalExamQuiz','masterChallengeQuiz','transferQuiz','pickProbe',
    'recordAnswer','conceptMastery','conceptLevel','conceptsInEra','conceptsInBook',
    'dailySet','reviewQueue','checkAchievements','eraMastery','bookProgress','avgMastery',
    'recordGeo','geoStats','geoPickTargets']
    .concat(withUi ? ['go','render','startQuiz','startTlChallenge','startPlaceQuiz','renderResults'] : []);
  const exp = names.map(n => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(',');
  return eval(src + `\n;({${exp}, setQ: v => { Q = v; }, getQ: () => Q, nextQuestion: typeof nextQuestion !== 'undefined' ? nextQuestion : null})`);
}

let failures = 0;
const test = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); }
  catch (e) { console.log('  FAIL ' + name + ' -> ' + e.message); failures++; }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
const done = () => { console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed.'); process.exit(failures ? 1 : 0); };

module.exports = { load, test, assert, done };
