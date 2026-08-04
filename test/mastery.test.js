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

done();
