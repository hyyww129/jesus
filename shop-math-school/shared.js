/* Shop Math School — the shared engine.
   State lives in window.name only (survives navigation and reload in this tab,
   dies with the tab — scores are memory-only by design). No storage APIs. */
(function () {
  "use strict";

  /* ---------------- the course map ---------------- */
  var WORLDS = [
    { n: 1, name: 'NUMBER BASICS', tag: 'assume you know nothing — build it all' },
    { n: 2, name: 'MEASUREMENT', tag: 'rulers, calipers, mics, thousandths' },
    { n: 3, name: 'ALGEBRA & FORMULAS', tag: 'the shop formulas, plug in and rearrange' },
    { n: 4, name: 'GEOMETRY & TRIG', tag: 'the geometry the mill runs on' },
    { n: 5, name: 'BLUEPRINTS & GD&T', tag: 'read the part\'s instruction manual' },
  ];
  var LEVELS = [
    { id: 'l1',  n: 1,  w: 1, title: 'Counting & Place Value', file: 'levels/l01-place-value.html', built: true,
      desc: 'Ones, tens, hundreds — then tenths, hundredths, thousandths. Every digit has a seat.' },
    { id: 'l2',  n: 2,  w: 1, title: 'Add & Subtract', file: 'levels/l02-add-subtract.html', built: false,
      desc: 'Carrying and borrowing you can watch happen. Decimals line up on the point.' },
    { id: 'l3',  n: 3,  w: 1, title: 'Times Tables & Multiply', file: 'levels/l03-multiply.html', built: false,
      desc: 'Tables 2–12 as a speed game, then multi-digit multiply as area boxes.' },
    { id: 'l4',  n: 4,  w: 1, title: 'Division from Zero', file: 'levels/l04-division.html', built: false,
      desc: 'Division as sharing, then long division digit by digit — 3÷8 becomes 0.375 in front of you.' },
    { id: 'l5',  n: 5,  w: 1, title: 'Fractions', file: 'levels/l05-fractions.html', built: false,
      desc: 'What a fraction IS, equivalents, adding halves through sixteenths. Pie and ruler side by side.' },
    { id: 'l6',  n: 6,  w: 1, title: 'Fractions ↔ Decimals', file: 'levels/l06-frac-decimals.html', built: false,
      desc: 'Every 64th, with the machinist landmarks: .125, .250, .375, .500, .625, .750, .875.' },
    { id: 'l7',  n: 7,  w: 1, title: 'Negative Numbers', file: 'levels/l07-negatives.html', built: false,
      desc: 'The number line, why left/down is minus, adding signed numbers. Predict the crane.' },
    { id: 'l8',  n: 8,  w: 1, title: 'Percents & Ratios', file: 'levels/l08-percents.html', built: false,
      desc: 'Percent as per-hundred, finding 10% fast, scaling a feed by a ratio.' },
    { id: 'l9',  n: 9,  w: 2, title: 'Reading a Ruler', file: 'levels/l09-ruler.html', built: false,
      desc: 'Inches to 1/16 and 1/32 on a zoomable ruler. Find 2-5/16 against the clock.' },
    { id: 'l10', n: 10, w: 2, title: 'Thousandths Thinking', file: 'levels/l10-thousandths.html', built: false,
      desc: 'A thou (.001), a shop tenth (.0001), saying sizes out loud — "three seventy-five".' },
    { id: 'l11', n: 11, w: 2, title: 'Calipers', file: 'levels/l11-calipers.html', built: false,
      desc: 'Read digital and dial caliper simulations to .001.' },
    { id: 'l12', n: 12, w: 2, title: 'Micrometers', file: 'levels/l12-micrometers.html', built: false,
      desc: 'Barrel + thimble to .0001, vernier tenths included.' },
    { id: 'l13', n: 13, w: 2, title: 'Metric ↔ Inch', file: 'levels/l13-metric.html', built: false,
      desc: 'mm to inches (÷25.4) and back, and when each shows up.' },
    { id: 'l14', n: 14, w: 3, title: 'Using a Formula', file: 'levels/l14-formulas.html', built: false,
      desc: 'What a variable is. Plug numbers into a recipe, solve for the one unknown.' },
    { id: 'l15', n: 15, w: 3, title: 'Rearranging', file: 'levels/l15-rearranging.html', built: false,
      desc: 'Move one thing across the equals sign. Solve for the red letter.' },
    { id: 'l16', n: 16, w: 3, title: 'RPM & Cutting Speed', file: 'levels/l16-rpm.html', built: false,
      desc: 'RPM = SFM × 3.82 ÷ D with a spindle that visibly spins. Capped at 4200.' },
    { id: 'l17', n: 17, w: 3, title: 'Feed Rate', file: 'levels/l17-feed.html', built: false,
      desc: 'IPM = RPM × flutes × chip load, live, with the starter table.' },
    { id: 'l18', n: 18, w: 3, title: 'Depth & Passes', file: 'levels/l18-depth.html', built: false,
      desc: 'Depth ÷ per-pass, peck drilling, stepover — watch the passes draw themselves.' },
    { id: 'l19', n: 19, w: 4, title: 'Shapes & Angles', file: 'levels/l19-angles.html', built: false,
      desc: 'Degrees, right angles, complementary/supplementary, triangles sum to 180.' },
    { id: 'l20', n: 20, w: 4, title: 'Perimeter, Area, Circles', file: 'levels/l20-area-circles.html', built: false,
      desc: 'Rectangle and circle area, circumference = πD — where the 3.82 comes from.' },
    { id: 'l21', n: 21, w: 4, title: 'Pythagoras', file: 'levels/l21-pythagoras.html', built: false,
      desc: 'a² + b² = c². Drag the corners, watch the equation live.' },
    { id: 'l22', n: 22, w: 4, title: 'Right-Triangle Trig', file: 'levels/l22-trig.html', built: false,
      desc: 'SOH-CAH-TOA with a unit-circle animation. Angle + distance → X and Y.' },
    { id: 'l23', n: 23, w: 4, title: 'Bolt-Hole Circles', file: 'levels/l23-bolt-circles.html', built: false,
      desc: 'X = Xc + R·cos θ, Y = Yc + R·sin θ. Place the holes before the machine does.' },
    { id: 'l24', n: 24, w: 5, title: 'Blueprint Basics', file: 'levels/l24-blueprint-basics.html', built: false,
      desc: 'Title block, views, line types, scale — what each line on the page means.' },
    { id: 'l25', n: 25, w: 5, title: 'Dimensions & Callouts', file: 'levels/l25-dimensions.html', built: false,
      desc: 'Dimension lines, Ø vs R, hole callouts, THRU vs depth.' },
    { id: 'l26', n: 26, w: 5, title: 'Tolerances', file: 'levels/l26-tolerances.html', built: false,
      desc: 'Nominal ± tolerance, limits, MAX and MIN material. Accept / rework / scrap.' },
    { id: 'l27', n: 27, w: 5, title: 'Intro to GD&T', file: 'levels/l27-gdt-intro.html', built: false,
      desc: 'Feature control frames, datums, and the big symbols — each with a pass part and a fail part.' },
    { id: 'l28', n: 28, w: 5, title: 'Position Tolerance Deep-Dive', file: 'levels/l28-position.html', built: false,
      desc: 'True position, round zones vs square, bonus tolerance at MMC kept simple.' },
    { id: 'l29', n: 29, w: 5, title: 'FINAL BOSS: Read a Real Print', file: 'levels/l29-final-print.html', built: false,
      desc: 'A complete blueprint — views, holes, a bolt circle, tolerances, GD&T. Pass it: Toolmaker.' },
  ];
  var RANKS = ['Apprentice', 'Operator', 'Setup', 'Machinist', 'Toolmaker'];

  /* ---------------- state (window.name) ---------------- */
  function loadState() {
    try {
      var s = JSON.parse(window.name || '');
      if (s && s.__sms === 1 && s.lv) return s;
    } catch (e) { /* fresh tab */ }
    return { __sms: 1, lv: {} };
  }
  var state = loadState();
  function save() { window.name = JSON.stringify(state); }
  function rec(id) {
    if (!state.lv[id]) state.lv[id] = { passed: false, best: 0, attempts: 0, confidence: 0, bestStreak: 0, points: 0 };
    if (state.lv[id].bestStreak === undefined) state.lv[id].bestStreak = 0;
    if (state.lv[id].points === undefined) state.lv[id].points = 0;
    return state.lv[id];
  }
  function recordBoss(id, pct) {
    var r = rec(id);
    r.attempts += 1;
    if (pct > r.best) r.best = pct;
    if (pct >= 90) r.passed = true;
    r.confidence = Math.max(r.confidence, pct);
    save();
  }
  function recordGame(id, points, streak) {
    var r = rec(id);
    if (points > r.points) r.points = points;
    if (streak > r.bestStreak) r.bestStreak = streak;
    save();
  }
  function nudge(id, ok) {
    var r = rec(id);
    r.confidence = Math.max(0, Math.min(100, r.confidence + (ok ? 1 : -2)));
    save();
  }
  function levelIndex(id) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return i;
    return -1;
  }
  function isUnlocked(id) {
    var i = levelIndex(id);
    if (i <= 0) return true;
    return rec(LEVELS[i - 1].id).passed;
  }
  function worldComplete(w) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].w === w && !rec(LEVELS[i].id).passed) return false;
    }
    return true;
  }
  function rankInfo() {
    var done = 0;
    for (var w = 1; w <= 5; w++) { if (worldComplete(w)) done++; else break; }
    var idx = done >= 5 ? 4 : Math.min(done, 3);
    var passedCount = 0;
    for (var i = 0; i < LEVELS.length; i++) if (rec(LEVELS[i].id).passed) passedCount++;
    return { rank: RANKS[idx], idx: idx, worldsDone: done, passed: passedCount,
      next: idx < 4 ? RANKS[idx + 1] : null };
  }

  /* ---------------- small helpers ---------------- */
  function fmt(v, places) { return Number(v).toFixed(places === undefined ? 3 : places); }
  function fmtExact(v, min) {
    var s = String(Math.round(v * 1e6) / 1e6);
    if (min) {
      var dp = (s.split('.')[1] || '').length;
      if (dp < min) s = Number(v).toFixed(min);
    }
    return s;
  }
  function parseNum(raw) {
    if (raw === undefined || raw === null) return NaN;
    raw = String(raw).trim().replace(/["\s,]/g, '').replace(/−/g, '-');
    if (raw === '') return NaN;
    var m = raw.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (m) return Number(m[1]) / Number(m[2]);
    return parseFloat(raw);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* number words — used for the plain-English meaning lines */
  function intWords(n) {
    n = Math.round(Math.abs(n));
    var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten',
      'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + intWords(n % 100) : '');
    return intWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + intWords(n % 1000) : '');
  }
  /* say a decimal the place-value way: 357.25 -> "three hundred fifty-seven and twenty-five hundredths" */
  function placeWords(v, decPlaces) {
    var neg = v < 0; v = Math.abs(v);
    var s = decPlaces === undefined ? String(v) : v.toFixed(decPlaces);
    var parts = s.split('.');
    var ip = parseInt(parts[0], 10) || 0;
    var dp = parts[1] || '';
    if (decPlaces === undefined) dp = dp.replace(/0+$/, '');
    var out = intWords(ip);
    if (dp && dp.length && parseInt(dp, 10) > 0) {
      var names = { 1: 'tenth', 2: 'hundredth', 3: 'thousandth' };
      var unit = names[dp.length] || 'part';
      var dn = parseInt(dp, 10);
      var frag = intWords(dn) + ' ' + unit + (dn === 1 ? '' : 's');
      out = ip === 0 ? frag : out + ' and ' + frag;
    }
    return (neg ? 'minus ' : '') + out;
  }

  /* ---------------- DRO panel ---------------- */
  function dro(el, axisLabel) {
    el.classList.add('dro');
    el.innerHTML = '<div class="row"><span class="ax">' + esc(axisLabel || '') +
      '</span><span class="val"></span></div><div class="meaning"></div>';
    var val = el.querySelector('.val'), mean = el.querySelector('.meaning');
    return { set: function (v, meaningHTML) { val.textContent = v; mean.innerHTML = meaningHTML || ''; } };
  }

  /* ---------------- the game runner ----------------
     runGame(container, {mode:'game'|'boss'|'daily', questions, title, passPct,
                         levelId, onFinish, onAnswer})
     Question contract: {q (HTML), type:'num'|'mc', a, tol, choices, explain,
       hint, steps, diagnose(v)->{label,your,right}|string|null, unit, from, kind}
     Scoring: +10 first-try correct, +5 bonus while streak >= 3. Streaks and best
     streak show live. Wrong answers diagnose the mistake and (game/daily only)
     offer TRY IT AGAIN — retries teach but never score. */
  function runGame(container, opts) {
    var qs = opts.questions;
    var isBoss = opts.mode === 'boss';
    var i = 0, correct = 0, points = 0, streak = 0, bestStreak = 0;

    qs.forEach(function (q) {
      if (q.type === 'mc') q.order = shuffle(q.choices.map(function (_, k) { return k; }));
    });

    function scorebarHTML() {
      return '<div class="scorebar"><span>POINTS <b>' + points + '</b></span>' +
        '<span>STREAK <b>' + streak + '</b>' + (streak >= 3 ? ' 🔥' : '') + '</span>' +
        '<span>BEST <b>' + bestStreak + '</b></span>' +
        '<span class="right">' + correct + ' / ' + i + ' right</span></div>';
    }

    function render() {
      if (i >= qs.length) return renderEnd();
      var q = qs[i];
      var h = '<div class="q-progress">' + esc(opts.title || (isBoss ? 'BOSS' : 'GAME')) +
        ' — ROUND ' + (i + 1) + ' / ' + qs.length +
        (q.from ? ' · from ' + esc(q.from) : '') + '</div>' +
        '<div class="q-text">' + q.q + '</div>';
      if (q.type === 'mc') {
        h += '<div class="choices">' + q.order.map(function (ci, k) {
          return '<button data-k="' + k + '">' + String.fromCharCode(65 + k) + ' · ' + q.choices[ci] + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<div class="answer-row"><input type="text" inputmode="decimal" autocomplete="off" ' +
          'placeholder="' + esc(q.unit ? 'answer in ' + q.unit : 'type your answer') + '" aria-label="answer">' +
          '<button class="primary" data-go>CHECK</button></div>';
      }
      if (!isBoss) {
        h += '<div class="btnrow help-row" style="margin-top:10px">' +
          (q.hint ? '<button data-hint>💡 WHERE DO I START?</button>' : '') +
          '</div><div class="hint-slot"></div>';
      }
      h += '<div class="fb-slot"></div>';
      if (!isBoss) h += scorebarHTML();
      container.innerHTML = h;

      if (q.type === 'mc') {
        container.querySelectorAll('.choices button').forEach(function (b) {
          b.addEventListener('click', function () { answerMC(q, Number(b.dataset.k), b); });
        });
        container.querySelector('.choices button').focus();
      } else {
        var input = container.querySelector('input');
        var go = function () { answerNum(q, input.value); };
        container.querySelector('[data-go]').addEventListener('click', go);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
        input.focus();
      }
      var hb = container.querySelector('[data-hint]');
      if (hb) hb.addEventListener('click', function () {
        container.querySelector('.hint-slot').innerHTML =
          '<div class="hintbox"><b>WHERE TO START</b> ' + q.hint + '</div>';
        hb.disabled = true;
      });
    }

    function answerMC(q, k, btn) {
      var chosen = q.order[k];
      var ok = chosen === q.a;
      btn.style.background = ok ? 'var(--good-bd)' : 'var(--orange)';
      btn.style.color = '#fff';
      var diag = (!ok && q.diagnose) ? q.diagnose(chosen) : null;
      finish(q, ok, String(q.choices[chosen]).replace(/<[^>]*>/g, ''), diag);
    }
    function answerNum(q, raw) {
      var v = parseNum(raw);
      if (isNaN(v)) {
        container.querySelector('.fb-slot').innerHTML =
          '<div class="feedback bad"><b>Type a number.</b> Decimals like 0.375 work; use a leading − for negatives.</div>';
        return;
      }
      var ok = Math.abs(v - q.a) <= (q.tol === undefined ? 0.0005 : q.tol);
      var diag = (!ok && q.diagnose) ? q.diagnose(v) : null;
      finish(q, ok, fmtExact(v), diag);
    }

    function finish(q, ok, shown, diag) {
      var first = !q._attempted;
      q._attempted = true;
      if (first) {
        i += 1;
        if (ok) {
          correct += 1;
          streak += 1;
          if (streak > bestStreak) bestStreak = streak;
          var gain = 10 + (streak >= 3 ? 5 : 0);
          points += gain;
          q._gain = gain;
        } else {
          streak = 0;
        }
        if (opts.onAnswer) opts.onAnswer(q, ok);
      }
      showFeedback(q, ok, shown, diag, !first);
    }

    function showFeedback(q, ok, shown, diag, wasRetry) {
      container.querySelectorAll('.choices button, .answer-row input, .answer-row button, [data-hint]')
        .forEach(function (el) { el.disabled = true; });
      var slot = container.querySelector('.fb-slot');
      var h;
      if (ok) {
        h = '<div class="feedback good"><b>' + (wasRetry ? 'Got it on the retry — that counts where it matters.' :
          'Nailed it.' + (q._gain ? ' <span class="pts">+' + q._gain + (q._gain > 10 ? ' 🔥 streak bonus' : '') + '</span>' : '')) + '</b>' +
          (q.explain || '') + '</div>';
      } else {
        var diagHtml = '';
        if (diag) {
          if (typeof diag === 'string') diagHtml = '<span class="diag">' + diag + '</span>';
          else diagHtml = '<span class="diag">' + esc(diag.label) + '.' +
            '<span class="pathrow wrong">Where your number probably came from: <span class="path">' + diag.your + '</span></span>' +
            '<span class="pathrow right">The right path: <span class="path">' + diag.right + '</span></span></span>';
        }
        h = '<div class="feedback bad"><b>Not this time. You answered ' + esc(shown) + '.</b>' +
          (q.explain || '') + diagHtml +
          (q.steps ? '<span class="steps"><b>THE WHOLE PATH</b>' + q.steps + '</span>' : '') +
          '</div>';
      }
      h += '<div class="btnrow" style="margin-top:10px">' +
        (!ok && !isBoss && !wasRetry ? '<button data-retry>TRY IT AGAIN</button>' : '') +
        '<button class="primary" data-next>' + (i >= qs.length ? 'FINISH' : 'NEXT ROUND →') + '</button></div>';
      slot.innerHTML = h;
      var bar = container.querySelector('.scorebar');
      if (bar) bar.outerHTML = scorebarHTML();
      var rb = slot.querySelector('[data-retry]');
      if (rb) rb.addEventListener('click', function () {
        container.querySelectorAll('.choices button, .answer-row input, .answer-row button')
          .forEach(function (el) {
            el.disabled = false;
            el.style.background = ''; el.style.color = '';
          });
        var input = container.querySelector('.answer-row input');
        if (input) { input.value = ''; input.focus(); }
        slot.innerHTML = '';
      });
      slot.querySelector('[data-next]').addEventListener('click', render);
      slot.querySelector('[data-next]').focus();
    }

    function renderEnd() {
      var pct = Math.round(correct / qs.length * 100);
      var passPct = opts.passPct || 90;
      var passed = pct >= passPct;
      var h = '<div class="result-banner">' +
        '<div class="big ' + (isBoss ? (passed ? 'pass' : 'fail') : 'pass') + '">' + correct + ' / ' + qs.length + '</div>' +
        (isBoss
          ? '<p>' + (passed ? 'BOSS DOWN — ' + pct + '%. The next level is yours.' :
              pct + '%. The boss wants ' + passPct + '%. Replay the game, then come back — bosses fall on the second try all the time.') + '</p>'
          : opts.mode === 'daily'
            ? '<p>' + points + ' points · best streak ' + bestStreak + '. Review done — same time tomorrow.</p>'
            : '<p>' + points + ' points · best streak ' + bestStreak +
              '. The boss round is where it counts — hit it when this feels easy.</p>') +
        '</div>';
      container.innerHTML = h;
      if (opts.levelId && !isBoss) recordGame(opts.levelId, points, bestStreak);
      if (opts.onFinish) opts.onFinish(pct, points, bestStreak);
    }

    render();
  }

  /* ---------------- Daily 10 banks ---------------- */
  var BANKS = {};

  BANKS.l1 = function () {
    var kind = pick(['digitWorth', 'digitWorth', 'assemble', 'compare']);
    if (kind === 'digitWorth') {
      var seats = [[100, 'hundreds'], [10, 'tens'], [1, 'ones'], [0.1, 'tenths'], [0.01, 'hundredths']];
      var si = Math.floor(Math.random() * seats.length);
      var d = 1 + Math.floor(Math.random() * 9);
      var digits = [1 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      digits[si] = d;
      for (var k2 = 0; k2 < 5; k2++) if (k2 !== si && digits[k2] === d) digits[k2] = (d + 1 + k2) % 10;
      var num = digits[0] * 100 + digits[1] * 10 + digits[2] + digits[3] * 0.1 + digits[4] * 0.01;
      var numStr = digits[0] + '' + digits[1] + '' + digits[2] + '.' + digits[3] + '' + digits[4];
      var a = Math.round(d * seats[si][0] * 100) / 100;
      return { type: 'num', a: a, tol: 0.0005, from: 'Level 1',
        q: 'In <span class="num">' + numStr + '</span>, what is the <span class="num">' + d + '</span> actually worth?',
        explain: 'The ' + d + ' sits in the ' + seats[si][1] + ' seat: ' + d + ' × ' + seats[si][0] +
          ' = <span class="num">' + fmtExact(a) + '</span>.',
        hint: 'Find which SEAT the digit sits in (count from the decimal point). The seat is a multiplier: digit × seat value.',
        steps: '1 · Locate the digit\'s seat: ' + seats[si][1] + '<br>' +
          '2 · Worth = digit × seat = <span class="num">' + d + '</span> × <span class="num">' + seats[si][0] +
          '</span> = <span class="res">' + fmtExact(a) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - d) < 0.0005 && seats[si][0] !== 1) return { label: 'Face value only',
            your: 'you read the digit ' + d + ' by itself — but its seat multiplies it',
            right: d + ' × ' + seats[si][0] + ' = ' + fmtExact(a) };
          if (Math.abs(v - a * 10) < 0.005 || Math.abs(v - a / 10) < 0.005) return { label: 'One seat over',
            your: 'right digit, neighboring seat: ' + fmtExact(v),
            right: 'the ' + d + ' is in the ' + seats[si][1] + ' seat → ' + fmtExact(a) };
          return { label: 'Seat slip',
            your: fmtExact(v) + ' is not digit × seat',
            right: d + ' × ' + seats[si][0] + ' = ' + fmtExact(a) };
        } };
    }
    if (kind === 'assemble') {
      var h2 = 1 + Math.floor(Math.random() * 9), t2 = Math.floor(Math.random() * 10),
        o2 = Math.floor(Math.random() * 10), te2 = Math.floor(Math.random() * 10);
      var a2 = Math.round((h2 * 100 + t2 * 10 + o2 + te2 * 0.1) * 10) / 10;
      return { type: 'num', a: a2, tol: 0.0005, from: 'Level 1',
        q: '<span class="num">' + h2 + '</span> hundreds + <span class="num">' + t2 + '</span> tens + ' +
          '<span class="num">' + o2 + '</span> ones + <span class="num">' + te2 + '</span> tenths = ?',
        explain: h2 + '×100 + ' + t2 + '×10 + ' + o2 + '×1 + ' + te2 + '×0.1 = <span class="num">' + fmtExact(a2) + '</span>.',
        hint: 'Give every count its seat and add: hundreds ×100, tens ×10, ones ×1, tenths ×0.1. Zeros still hold their seat.',
        steps: '1 · ' + h2 + '×100 = ' + h2 * 100 + ' · ' + t2 + '×10 = ' + t2 * 10 + ' · ' + o2 + '×1 = ' + o2 +
          ' · ' + te2 + '×0.1 = ' + fmtExact(te2 * 0.1) + '<br>2 · Add: <span class="res">' + fmtExact(a2) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - (h2 * 100 + t2 * 10 + o2 + te2 * 0.01)) < 0.0005 && te2 !== 0) return { label: 'Tenths landed in the hundredths seat',
            your: fmtExact(v) + ' put the ' + te2 + ' two seats right of the point',
            right: te2 + ' TENTHS = ' + te2 + ' × 0.1 = ' + fmtExact(te2 * 0.1) };
          if (Math.abs(v - parseFloat('' + h2 + t2 + o2 + te2)) < 0.5) return { label: 'Digits glued together',
            your: 'you strung the counts into ' + h2 + '' + t2 + '' + o2 + '' + te2 + ' — the decimal point vanished',
            right: 'the tenths live RIGHT of the point: ' + fmtExact(a2) };
          return { label: 'Seat slip',
            your: fmtExact(v) + ' is not the sum of digit × seat',
            right: h2 + '×100 + ' + t2 + '×10 + ' + o2 + ' + ' + te2 + '×0.1 = ' + fmtExact(a2) };
        } };
    }
    var pairs = [['0.5', '0.375'], ['0.25', '0.3'], ['0.75', '0.8'], ['0.625', '0.7'], ['0.4', '0.125'], ['0.05', '0.2']];
    var p2 = pick(pairs);
    var bigger = parseFloat(p2[0]) > parseFloat(p2[1]) ? 0 : 1;
    return { type: 'mc', a: bigger, choices: [p2[0], p2[1]], from: 'Level 1',
      q: 'Which number is <b>larger</b>?',
      explain: 'Pad to the same length and compare seat by seat: ' +
        p2[0] + ' vs ' + p2[1] + ' → <span class="num">' + p2[bigger] + '</span> wins. More digits does NOT mean bigger.',
      hint: 'Give both numbers the same number of decimal places by padding zeros (0.5 → 0.500). Then compare left to right, seat by seat.',
      steps: '1 · Pad: ' + Number(p2[0]).toFixed(3) + ' vs ' + Number(p2[1]).toFixed(3) + '<br>' +
        '2 · Compare the tenths seat first, then hundredths<br>' +
        '3 · <span class="res">' + p2[bigger] + '</span> is larger',
      diagnose: function () {
        return { label: 'Longer looked larger',
          your: 'the number with more digits FEELS bigger — but extra decimal places are smaller and smaller pieces',
          right: 'pad and compare seats: ' + Number(p2[0]).toFixed(3) + ' vs ' + Number(p2[1]).toFixed(3) + ' → ' + p2[bigger] };
      } };
  };

  function daily10Questions() {
    var eligible = LEVELS.filter(function (l) { return l.built && rec(l.id).passed && BANKS[l.id]; });
    if (!eligible.length) {
      eligible = LEVELS.filter(function (l) { return l.built && isUnlocked(l.id) && BANKS[l.id]; });
    }
    if (!eligible.length) return [];
    var qs = [];
    for (var k = 0; k < 10; k++) {
      var l = eligible[k % eligible.length];
      var q = BANKS[l.id]();
      q.levelId = l.id;
      qs.push(q);
    }
    return shuffle(qs);
  }

  /* ---------------- level page chrome ---------------- */
  function levelPage(id, parts) {
    var lvl = LEVELS[levelIndex(id)];
    var root = document.getElementById('sms-root');
    var TABS = [['1', 'EXPLAINER'], ['2', 'PLAYGROUND'], ['3', 'GAME'], ['4', 'BOSS']];
    root.innerHTML =
      '<div class="tabs">' + TABS.map(function (t, k) {
        return '<button data-tab="' + k + '" class="' + (k === 0 ? 'on' : '') + '">' +
          '<span class="step-n">PART ' + t[0] + '</span>' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div id="tab-panes"></div>';
    var panes = root.querySelector('#tab-panes');
    var current = -1;

    function open(k) {
      if (k === current) return;
      current = k;
      root.querySelectorAll('.tabs button').forEach(function (b, j) {
        b.classList.toggle('on', j === k);
      });
      panes.innerHTML = '';
      if (k === 0) { panes.innerHTML = parts.explainer; }
      if (k === 1) { parts.playground(panes); }
      if (k === 2) {
        var c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = '<h2>Game — 10 rounds · points and streaks · mistakes get named</h2><div class="body"></div>';
        panes.appendChild(c);
        runGame(c.querySelector('.body'), {
          mode: 'game', title: 'GAME', levelId: id, questions: parts.gameQs(),
        });
      }
      if (k === 3) {
        var c2 = document.createElement('div');
        c2.className = 'card';
        c2.innerHTML = '<h2>Boss round — 90% unlocks the next level · no hints, no retries</h2><div class="body"></div>';
        panes.appendChild(c2);
        runGame(c2.querySelector('.body'), {
          mode: 'boss', title: 'BOSS', questions: parts.bossQs(), passPct: 90,
          onFinish: function (pct) {
            recordBoss(id, pct);
            var r = rec(id);
            var next = LEVELS[levelIndex(id) + 1];
            var extra = document.createElement('div');
            extra.className = 'callout' + (pct >= 90 ? '' : ' warn');
            extra.innerHTML = pct >= 90
              ? '<b>Level ' + lvl.n + ' beaten.</b> ' +
                (next ? (next.built ? 'Level ' + next.n + ' — ' + esc(next.title) + ' — is unlocked on the skill tree.'
                                    : 'Level ' + next.n + ' is unlocked. It gets built next — go say the word.')
                      : 'That was the last level. Toolmaker.') +
                ' Best: ' + r.best + '%. <a href="../index.html">Back to the skill tree →</a>'
              : 'Best so far: ' + r.best + '%. Scores only go up — replay the game, then hit the boss again. ' +
                '<a href="../index.html">Skill tree →</a>';
            c2.querySelector('.body').appendChild(extra);
          },
        });
      }
    }
    root.querySelectorAll('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () { open(Number(b.dataset.tab)); });
    });
    open(0);
    return { open: open };
  }

  /* ---------------- export ---------------- */
  window.SMS = {
    WORLDS: WORLDS, LEVELS: LEVELS, RANKS: RANKS, BANKS: BANKS,
    state: state, save: save, rec: rec,
    recordBoss: recordBoss, recordGame: recordGame, nudge: nudge,
    isUnlocked: isUnlocked, worldComplete: worldComplete, rankInfo: rankInfo,
    fmt: fmt, fmtExact: fmtExact, parseNum: parseNum,
    shuffle: shuffle, pick: pick, esc: esc,
    intWords: intWords, placeWords: placeWords,
    dro: dro, runGame: runGame, daily10Questions: daily10Questions,
    levelPage: levelPage,
  };
})();
