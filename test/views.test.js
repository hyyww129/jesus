/* Renders every screen and plays every quiz type against a stubbed DOM.
   Catches template and reference errors without a browser. */
const { load, test, assert, done } = require('./_load');
const X = load(true);

['journey','books','read','timeline','map','people','palace','daily','review','transfer','final','master','dashboard','achievements','about']
  .forEach(v => test('renders ' + v, () => X.go(v)));

test('scripture reader renders book list, chapter grid, text and search', () => {
  X.go('read', 'books');
  X.go('read', 'gen');
  X.go('read', 'gen:1');
  assert(X.S.reader && X.S.reader.b === 'gen' && X.S.reader.c === 1, 'position not remembered');
  X.go('read', 'joh:3:16');
  assert(X.S.reader.b === 'joh' && X.S.reader.c === 3, 'position not updated on jump');
  X.go('read'); /* resume from S.reader */
});

test('reference jump understands common forms', () => {
  const cases = [
    ['John 3:16', { b: 'joh', c: 3, v: 16 }],
    ['Gen 1', { b: 'gen', c: 1, v: null }],
    ['1 Cor 13', { b: '1co', c: 13, v: null }],
    ['psalm 23:1', { b: 'psa', c: 23, v: 1 }],
    ['Song of Songs 2', { b: 'sng', c: 2, v: null }],
    ['rev 22:21', { b: 'rev', c: 22, v: 21 }]
  ];
  cases.forEach(([input, want]) => {
    const got = X.parseRef(input);
    assert(got && got.b === want.b && got.c === want.c && got.v === want.v,
      input + ' -> ' + JSON.stringify(got));
  });
  assert(X.parseRef('Gen 99') === null, 'chapter beyond the book should fail');
  assert(X.parseRef('nowhere 3') === null, 'unknown book should fail');
});

test('scripture search finds words and phrases', () => {
  const r = X.bibleSearch('for God so loved the world', 100);
  assert(r.total >= 1 && r.list.some(x => x.b === 'joh' && x.c === 3 && x.v === 16), 'John 3:16 not found');
  const shep = X.bibleSearch('shepherd', 100);
  assert(shep.total > 30 && shep.list.length === Math.min(shep.total, 100), 'search cap mismatch');
  assert(X.bibleSearch('x', 100).total === 0, 'single letters should not search');
});

test('renders all 17 era pages', () => X.ERAS.forEach(e => X.go('era', e.id)));
test('renders all 66 book pages', () => X.BOOKS.forEach(b => X.go('book', b.id)));
test('renders every concept page', () => X.ALL_CONCEPTS.forEach(c => X.go('concept', c.id)));
test('renders every person page', () => X.PEOPLE.forEach(p => X.go('person', p.id)));
test('every person gets a well-formed illuminated portrait', () => {
  X.PEOPLE.forEach(p => {
    const s = X.portraitSVG(p);
    assert(s.includes('<svg') && s.includes('</svg>'), p.id + ' portrait malformed');
    assert(s.includes('aria-label'), p.id + ' portrait missing aria-label');
  });
  Object.keys(X.PERSON_ART).forEach(id => {
    assert(X.P_BY_ID[id], 'portrait art for unknown person: ' + id);
    (X.PERSON_ART[id].parts || []).forEach(k =>
      assert(X.PORTRAIT_PARTS[k], 'unknown portrait part: ' + k));
  });
});
test('renders every palace room', () => X.PALACE.forEach(r => X.go('room', r.id)));
test('timeline ordering challenge starts', () => { X.go('timeline'); X.startTlChallenge(); });
test('map place quiz starts', () => X.startPlaceQuiz(X.PL_BY_ID['jerusalem']));
test('who am I challenge starts with 8 rounds of 4 distinct options', () => {
  X.startWhoQuiz(); /* also renders the who view against the stub */
  const q = X.getWho();
  assert(q && q.rounds.length === 8, 'expected 8 rounds');
  q.rounds.forEach(r => {
    assert(new Set(r.opts).size === 4, 'options not distinct');
    assert(r.opts.includes(r.pid), 'target missing from its own options');
    r.opts.forEach(pid => assert(X.P_BY_ID[pid], 'option is not a real person: ' + pid));
  });
});

function play(spec) {
  X.startQuiz(spec);
  const Q = X.getQ();
  assert(Q && Q.list.length, 'quiz did not start: ' + spec);
  let guard = 0;
  while (Q.i < Q.list.length && guard++ < 500) {
    const item = Q.list[Q.i];
    X.recordAnswer(item.cid, item.i, Math.random() < 0.75 ? 'right' : 'wrong');
    Q.results.push({ cid: item.cid, i: item.i, t: item.p.t, result: 'right' });
    Q.i++; Q.answered = false; Q.state = null;
    X.render();
  }
  X.renderResults();
}

X.ERAS.forEach(e => test('plays boss battle: ' + e.id, () => play('boss:' + e.id)));
['book:gen:quiz','book:gen:timeline','book:gen:character','book:gen:connection','book:gen:mastery',
 'book:phm:quiz','book:oba:mastery','era:jesus','understanding:exodus','concept:c_sinai',
 'daily','review','transfer','final','master']
  .forEach(s => test('plays ' + s, () => play(s)));

test('screens still render after heavy play', () =>
  ['dashboard','review','daily','final','master','achievements','journey'].forEach(v => X.go(v)));
test('achievement predicates all evaluate', () => X.ACHIEVEMENTS.forEach(a => a.f()));

done();
