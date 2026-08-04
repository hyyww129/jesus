/* Validates every concept, probe, and cross-reference in the content database.
   Run after adding any new concept: npm test */
const { load, test, assert, done } = require('./_load');
const X = load(false);

const CHOICE = ['mc','tf','who','nxt','cse','scn','con','bok','fil'];
const ids = new Set();

test('concept ids are unique and reference real books and eras', () => {
  X.ALL_CONCEPTS.forEach(c => {
    assert(!ids.has(c.id), 'duplicate concept id: ' + c.id); ids.add(c.id);
    assert(X.B_BY_ID[c.b], c.id + ' has unknown book ' + c.b);
    assert(X.E_BY_ID[c.e], c.id + ' has unknown era ' + c.e);
    assert(c.ref && c.sum && c.topic, c.id + ' missing ref/sum/topic');
    assert(['text','inference','common','traditional','debated'].includes(c.claim), c.id + ' bad claim tag');
    assert(c.p && c.p.length >= 3, c.id + ' needs at least 3 probes');
  });
});

test('every probe is well formed for its type', () => {
  X.ALL_CONCEPTS.forEach(c => c.p.forEach((p, i) => {
    const tag = `${c.id}#${i}(${p.t})`;
    assert(p.l >= 1 && p.l <= 5, tag + ' bad level');
    if (CHOICE.includes(p.t)) {
      assert(Array.isArray(p.o) && p.o.length >= 2, tag + ' bad options');
      assert(typeof p.a === 'number' && p.a >= 0 && p.a < p.o.length, tag + ' answer index out of range');
      assert(new Set(p.o).size === p.o.length, tag + ' has duplicate options');
      assert(p.w, tag + ' missing explanation');
      if (p.t === 'who') assert(p.clues && p.clues.length, tag + ' missing clues');
      else assert(p.q, tag + ' missing question text');
    } else if (p.t === 'ord') {
      assert(Array.isArray(p.it) && p.it.length >= 3, tag + ' needs 3+ items');
      assert(new Set(p.it).size === p.it.length, tag + ' duplicate items');
      assert(p.w, tag + ' missing explanation');
    } else if (p.t === 'mat') {
      assert(Array.isArray(p.pr) && p.pr.length >= 2, tag + ' needs 2+ pairs');
      assert(new Set(p.pr.map(x => x[1])).size === p.pr.length, tag + ' duplicate right-hand answers');
    } else if (p.t === 'exp') {
      assert(p.keys && p.keys.length && p.model, tag + ' needs keys and a model answer');
    } else throw new Error(tag + ' unknown probe type');
  }));
});

test('all 66 books present, each with required fields', () => {
  assert(X.BOOKS.length === 66, 'expected 66 books, got ' + X.BOOKS.length);
  X.BOOKS.forEach(b => {
    assert(b.overview && b.setting && b.themes.length && b.connections.length, b.id + ' incomplete');
    assert(b.ch > 0 && ['OT','NT'].includes(b.t), b.id + ' bad chapters/testament');
    b.eras.forEach(e => assert(X.E_BY_ID[e], b.id + ' unknown era ' + e));
  });
});

test('people, places, timeline and palace cross-references resolve', () => {
  X.PEOPLE.forEach(p => p.books.forEach(b => assert(X.B_BY_ID[b], 'person ' + p.id + ' bad book ' + b)));
  X.PLACES.forEach(p => { assert(X.E_BY_ID[p.era], 'place ' + p.id + ' bad era');
    p.books.forEach(b => assert(X.B_BY_ID[b], 'place ' + p.id + ' bad book ' + b)); });
  X.TIMELINE.forEach(t => assert(X.E_BY_ID[t.era], 'timeline ' + t.id + ' bad era'));
  X.PALACE.forEach(r => r.anchor.forEach(a => assert(X.C_BY_ID[a], 'palace ' + r.id + ' missing anchor ' + a)));
});

test('map pins sit inside their panel and routes stay on the chart', () => {
  const ids = new Set(X.PLACES.map(p => p.id));
  assert(ids.size === X.PLACES.length, 'duplicate place id');
  X.PLACES.forEach(p => {
    assert(['world','land'].includes(p.panel), 'place ' + p.id + ' bad panel');
    if (p.panel === 'world') assert(p.x >= 0 && p.x <= 1000 && p.y >= 0 && p.y <= 570, 'place ' + p.id + ' outside viewBox');
    else assert(p.x >= 55 && p.x <= 330 && p.y >= 285 && p.y <= 547, 'place ' + p.id + ' outside the land inset');
  });
  assert(X.ROUTES.length === 3, 'expected the three missionary journeys');
  X.ROUTES.forEach(r => {
    assert(r.id && r.n && r.ref && r.d, 'route ' + r.id + ' incomplete');
    assert(r.pts.length >= 4, 'route ' + r.id + ' too few waypoints');
    r.pts.forEach(([x, y]) => assert(x >= 0 && x <= 1000 && y >= 0 && y <= 570, 'route ' + r.id + ' waypoint off the chart'));
  });
  X.MAP_DETAIL.towns.concat(X.MAP_DETAIL.regions).forEach(t => {
    assert(t.n && t.ref, 'map detail label missing name or reference');
    assert(t.x >= 0 && t.x <= 1000 && t.y >= 0 && t.y <= 570, 'map detail ' + t.n + ' off the chart');
  });
});

test('every era has concepts and can fill its boss battle', () => {
  X.ERAS.forEach(e => {
    assert(X.conceptsInEra(e.id).length, 'era with no concepts: ' + e.id);
    const q = X.bossQuiz(e.id);
    assert(q.length === e.boss, `${e.id} boss produced ${q.length}/${e.boss} questions — add more concepts to this era`);
  });
});

test('final exam reaches 100 unique questions; master challenge reaches 40', () => {
  const fe = X.finalExamQuiz();
  assert(fe.length === 100, 'final exam produced ' + fe.length);
  assert(new Set(fe.map(x => x.cid + ':' + x.i)).size === 100, 'final exam repeated a question');
  assert(X.masterChallengeQuiz().length === 40, 'master challenge short');
});

console.log(`\n  ${X.BOOKS.length} books · ${X.ALL_CONCEPTS.length} concepts · ` +
  `${X.ALL_CONCEPTS.reduce((n, c) => n + c.p.length, 0)} questions`);
done();
