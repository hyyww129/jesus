/* Guards the central rule: mastery cannot be earned by clicking through.
   If these fail, the game's core promise is broken. */
const { load, test, assert, done } = require('./_load');
const X = load(false);
const CID = 'c_flood';

test('one correct answer does not produce mastery', () => {
  X.recordAnswer(CID, 0, 'right');
  assert(X.conceptLevel(CID) < 5, 'single answer reached level 5');
  assert(X.conceptMastery(CID) < 40, 'single answer scored ' + X.conceptMastery(CID) + '%');
});

test('a perfect single session still stops short of mastery', () => {
  X.C_BY_ID[CID].p.forEach((p, i) => X.recordAnswer(CID, i, 'right'));
  assert(X.conceptLevel(CID) < 5, 'mastery reached inside one session');
});

test('mastery arrives on a clean second session', () => {
  X.S.session = 2;
  X.C_BY_ID[CID].p.forEach((p, i) => X.recordAnswer(CID, i, 'right'));
  assert(X.conceptLevel(CID) === 5, 'expected level 5, got ' + X.conceptLevel(CID));
});

test('a later miss removes mastery and resets the interval', () => {
  X.recordAnswer(CID, 0, 'wrong');
  assert(X.conceptLevel(CID) < 5, 'mastery survived a miss');
  assert(X.S.c[CID].next - Date.now() < 15 * 60000, 'review interval did not reset');
});

test('repeat visits to a concept vary the question asked', () => {
  const seen = new Set();
  for (let i = 0; i < 40; i++) seen.add(X.pickProbe(CID, {}).i);
  assert(seen.size >= 3, 'only ' + seen.size + ' distinct probes offered over 40 draws');
});

test('review queue prioritises weak and overdue concepts', () => {
  const q = X.reviewQueue(10);
  assert(q.length, 'review queue empty after a wrong answer');
  assert(q.every((x, i) => i === 0 || q[i - 1].score >= x.score), 'queue not sorted by urgency');
});

test('geography challenge keeps its own mastery track', () => {
  let g = X.recordGeo('jericho', true);
  assert(g.seen === 1 && g.right === 1 && g.streak === 1, 'first correct not recorded');
  X.recordGeo('jericho', true); X.recordGeo('jericho', true);
  assert(X.geoStats().known === 1, 'three straight rights should mark a place known');
  g = X.recordGeo('jericho', false);
  assert(g.streak === 0, 'a miss must reset the streak');
  assert(X.geoStats().known === 0, 'a place stays known after a miss');
  const s = X.geoStats();
  assert(s.seen === 4 && s.right === 3 && s.pct === 75, 'accuracy maths wrong: ' + JSON.stringify(s));
  const picks = X.geoPickTargets(8);
  assert(picks.length === 8, 'picker returned ' + picks.length);
  assert(!picks.some(p => p.id === 'jericho'), 'practised place crowded out fresh ones');
});

test('who-am-I keeps its own mastery track, separate from geography', () => {
  X.recordWho('moses', true); X.recordWho('moses', true); X.recordWho('moses', true);
  assert(X.whoStats().known === 1, 'three straight rights should mark a person sure');
  assert(X.whoStats().seen === 3 && X.geoStats().seen === 4, 'who and geo tracks bled together');
  const g = X.recordWho('moses', false);
  assert(g.streak === 0 && X.whoStats().known === 0, 'a miss must reset the person streak');
  const picks = X.whoPickTargets(8);
  assert(picks.length === 8 && !picks.some(p => p.id === 'moses'), 'practised person crowded out fresh ones');
});

test('a generated scripture drill feeds the mastery engine like any concept', () => {
  const d = X.registerDrill('psa', 23);
  const id = d.id;
  /* it earns levels through the normal machinery */
  X.recordAnswer(id, 0, 'right');
  assert(X.conceptLevel(id) >= 2, 'a right answer on a drill did not raise its level');
  assert(X.S.c[id] && X.S.c[id].seen >= 1, 'drill answer not recorded in S.c');
  /* and it is remembered for re-registration after a reload */
  assert((X.S.drilled || []).includes('psa:23'), 'drilled chapter not remembered in S.drilled');
  /* simulate a fresh load: drop the live concept, then restore from S.drilled */
  const idx = X.ALL_CONCEPTS.findIndex(c => c.id === id);
  X.ALL_CONCEPTS.splice(idx, 1);
  delete X.C_BY_ID[id];
  X.restoreDrills();
  assert(X.C_BY_ID[id], 'restoreDrills did not rebuild the drilled chapter');
  assert(X.S.c[id].seen >= 1, 'progress lost across the simulated reload');
});

done();
