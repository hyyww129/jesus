/* Machinist Math Trainer — shared helpers. Plain script, no modules, works from file://.
   Everything hangs off window.MMT.

   State lives in window.name: it survives page-to-page navigation in this tab but
   vanishes when the tab closes. Nothing is ever written to disk — scores are
   memory-only, as specified. */
(function () {
  "use strict";

  /* ---------------- module registry ---------------- */
  var MODULES = [
    { id: 'm1',  n: 1,  title: 'Reading a Ruler & Thousandths', file: 'modules/m01-ruler.html', built: true,
      desc: 'Fractions to decimals. What a thou (.001) and a tenth (.0001) really are.' },
    { id: 'm2',  n: 2,  title: 'The Number Line & Signed Moves', file: 'modules/m02-number-line.html', built: false,
      desc: 'Negative vs positive, and adding signed moves without guessing.' },
    { id: 'm3',  n: 3,  title: 'X, Y, Z Coordinates', file: 'modules/m03-coordinates.html', built: false,
      desc: 'The machine as graph paper. Part zero, absolute vs incremental.' },
    { id: 'm4',  n: 4,  title: 'The Edge Finder & Zero Offsets', file: 'modules/m04-edge-finder.html', built: false,
      desc: 'The 0.200 tip / 0.100 rule, sign by approach side, zero at center.' },
    { id: 'm5',  n: 5,  title: 'RPM from Cutting Speed', file: 'modules/m05-rpm.html', built: false,
      desc: 'RPM = SFM × 3.82 ÷ diameter — and why. Capped at 4200.' },
    { id: 'm6',  n: 6,  title: 'Feed Rate', file: 'modules/m06-feed.html', built: false,
      desc: 'IPM = RPM × flutes × chip load, with starter chip-load tables.' },
    { id: 'm7',  n: 7,  title: 'Depth, Peck & Passes', file: 'modules/m07-depth.html', built: false,
      desc: 'Splitting depth into passes, peck rules, pocket stepover.' },
    { id: 'm8',  n: 8,  title: 'Bolt-Hole Circle Trig', file: 'modules/m08-bolt-circle.html', built: false,
      desc: 'N holes on a circle with cos and sin doing the placing.' },
    { id: 'm9',  n: 9,  title: 'Right-Triangle Trig for Angles', file: 'modules/m09-triangles.html', built: false,
      desc: 'SOH-CAH-TOA: angle + distance into X and Y components.' },
    { id: 'm10', n: 10, title: 'Tolerances & Measurement', file: 'modules/m10-tolerance.html', built: false,
      desc: 'Calipers, mics, ±0.005, and which way to move the offset.' },
  ];

  /* machine truths for later modules — same numbers as the DPM3 trainer */
  var FACTS = {
    rpmMax: 4200,
    edgeFinderTip: 0.200, edgeFinderOffset: 0.100,
    sfm: { aluminumHSS: 250, aluminumCarbide: 600, steelHSS: 90, steelCarbide: 350 },
    chipload: { '0.125': 0.0008, '0.1875': 0.0012, '0.25': 0.0015, '0.375': 0.002, '0.5': 0.003, '0.75': 0.004 },
  };

  /* ---------------- state (window.name) ---------------- */
  function loadState() {
    try {
      var s = JSON.parse(window.name || '');
      if (s && s.__mmt === 1 && s.scores) return s;
    } catch (e) { /* fresh tab */ }
    return { __mmt: 1, scores: {} };
  }
  var state = loadState();
  function save() { window.name = JSON.stringify(state); }
  function rec(id) {
    if (!state.scores[id]) state.scores[id] = { best: 0, passed: false, confidence: 0, attempts: 0 };
    return state.scores[id];
  }
  function recordQuiz(id, pct) {
    var r = rec(id);
    r.attempts++;
    if (pct > r.best) r.best = pct;
    if (pct >= 90) r.passed = true;
    /* confidence starts as your best quiz score; Daily 10 nudges it after that */
    if (r.best > r.confidence) r.confidence = r.best;
    save();
  }
  function nudge(id, ok) {  /* Daily 10 spaced review: right +1, wrong −2 */
    var r = rec(id);
    if (r.attempts > 0 || r.confidence > 0) {
      r.confidence = Math.max(0, Math.min(100, r.confidence + (ok ? 1 : -2)));
      save();
    }
  }
  function moduleIndex(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return i; return -1; }
  function isUnlocked(id) {
    var i = moduleIndex(id);
    if (i <= 0) return true;
    return rec(MODULES[i - 1].id).passed;
  }

  /* ---------------- formatting ---------------- */
  function fmt(v, places) { return Number(v).toFixed(places === undefined ? 4 : places); }
  /* exact decimal for n/64ths etc: at least `min` places, no trailing-zero noise beyond it */
  function fmtExact(v, min) {
    min = min === undefined ? 4 : min;
    var s = Number(v).toFixed(6);
    while (s.length > 0 && s.indexOf('.') !== -1 && /0$/.test(s) &&
           s.length - s.indexOf('.') - 1 > min) s = s.slice(0, -1);
    return s;
  }
  function signed(v, places) { return (v >= 0 ? '+' : '') + fmt(v, places); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function reduceFrac(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function fracStr(n, d) { var r = reduceFrac(n, d); return r[0] + '/' + r[1]; }
  function parseNum(raw) {
    if (raw === undefined || raw === null) return NaN;
    raw = String(raw).trim().replace(/["\s,]/g, '').replace(/−/g, '-');
    if (raw === '') return NaN;
    /* accept fractions like 3/8 too */
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

  /* ---------------- voice: how a machinist SAYS a number ----------------
     speakText uses the browser's built-in speech (no network, no accounts).
     Two reading styles, used deliberately:
       literal — digit by digit ("zero point zero zero zero five"), safe for
                 reading questions aloud because it never reveals the answer;
       shop    — how it's said on the floor ("five tenths", "three hundred
                 seventy-five thou"), shown AFTER answering and in playgrounds. */
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
  function digitWords(str) {
    var map = { '0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five',
      '6':'six','7':'seven','8':'eight','9':'nine','.':'point','-':'minus','−':'minus' };
    return String(str).split('').map(function (c) { return map[c] || ''; })
      .filter(Boolean).join(' ');
  }
  /* shop-style words for an inch measurement */
  function sayMeasure(v, asTyped) {
    v = Number(v);
    var neg = v < 0, av = Math.abs(v);
    var inches = Math.floor(av + 1e-9);
    var frac = Math.round((av - inches) * 1e6) / 1e6;
    var shop;
    if (frac === 0) {
      shop = intWords(inches) + (inches === 1 ? ' inch' : ' inches');
    } else {
      var tenthsInt = Math.round(frac * 10000);
      var isTenthExact = Math.abs(frac * 10000 - tenthsInt) < 1e-4;
      var fracWords;
      if (!isTenthExact) {
        /* finer than tenths (e.g. 1/64 = 15.625 thou): decimal thou */
        var thouStr = String(Math.round(frac * 1e6) / 1000);
        var parts = thouStr.split('.');
        fracWords = intWords(+parts[0]) + (parts[1] ? ' point ' + digitWords(parts[1]) : '') + ' thou';
      } else if (tenthsInt % 10 === 0) {
        fracWords = intWords(tenthsInt / 10) + ' thou';
      } else if (tenthsInt < 10) {
        fracWords = intWords(tenthsInt) + (tenthsInt === 1 ? ' tenth' : ' tenths');
      } else if (tenthsInt % 10 === 5) {
        fracWords = intWords(Math.floor(tenthsInt / 10)) + ' and a half thou';
      } else {
        var r = tenthsInt % 10;
        fracWords = intWords(Math.floor(tenthsInt / 10)) + ' thou and ' + intWords(r) + (r === 1 ? ' tenth' : ' tenths');
      }
      shop = inches > 0
        ? intWords(inches) + (inches === 1 ? ' inch' : ' inches') + ' and ' + fracWords
        : fracWords;
    }
    if (neg) shop = 'minus ' + shop;
    var literal = digitWords(asTyped !== undefined ? asTyped : (av < 1 ? v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0') : String(v)));
    return { shop: shop, literal: literal };
  }
  function sayFraction(n, d) {
    var names = { 2:'half',4:'quarter',8:'eighth',16:'sixteenth',32:'thirty-second',64:'sixty-fourth' };
    var w = names[d];
    if (!w) return intWords(n) + ' over ' + intWords(d);
    if (n === 1) return 'one ' + w;
    return intWords(n) + ' ' + (d === 2 ? 'halves' : w + 's');
  }
  /* read a question's HTML aloud — numbers spoken LITERALLY so nothing leaks */
  function spokenFromHtml(html) {
    var s = String(html).replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ');
    s = s.replace(/(\d+)\s*\/\s*(\d+)/g, function (m, a, b) { return sayFraction(+a, +b); });
    s = s.replace(/(\d*\.\d+)\s*(?:")?/g, function (m, d) { return digitWords(d) + ' inches, '; });
    s = s.replace(/(\d+)"/g, function (m, d) { return intWords(+d) + ' inches'; });
    return s.replace(/\s+/g, ' ').trim();
  }
  /* how to SAY the correct answer, shop-style (shown after answering) */
  function sayAnswer(q) {
    if (q.type === 'mc') {
      var c = String(q.choices[q.a]).replace(/<[^>]*>/g, '').replace(/"/g, '').trim();
      var m = c.match(/^(\d+)\/(\d+)$/);
      if (m) return sayFraction(+m[1], +m[2]);
      var d = parseFloat(c);
      if (!isNaN(d)) return sayMeasure(d, c).shop;
      return null;
    }
    if (q.unit === 'thou') return intWords(Math.round(q.a)) + ' thou';
    if (q.unit === 'tenths') return intWords(Math.round(q.a)) + (Math.round(q.a) === 1 ? ' tenth' : ' tenths');
    var s = sayMeasure(q.a);
    return s.shop + ' — read off the DRO as ' + s.literal;
  }
  function speakText(t) {
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(t);
      u.rate = 0.92;
      var vs = speechSynthesis.getVoices();
      var v = null;
      for (var k = 0; k < vs.length; k++) {
        if (/en[-_]US/i.test(vs[k].lang)) { v = vs[k]; break; }
        if (!v && /^en/i.test(vs[k].lang)) v = vs[k];
      }
      if (v) u.voice = v;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* no speech on this device — buttons just do nothing */ }
  }

  /* ---------------- DRO panel ---------------- */
  /* dro(el, axisLabel) -> {set(valueString, meaningHTML)} */
  function dro(el, axisLabel) {
    el.classList.add('dro');
    el.innerHTML = '<div class="row"><span class="ax">' + esc(axisLabel || '') +
      '</span><span class="val">—</span></div><div class="meaning"></div>';
    var val = el.querySelector('.val'), meaning = el.querySelector('.meaning');
    return {
      set: function (valueString, meaningHTML) {
        val.textContent = valueString;
        meaning.innerHTML = meaningHTML || '';
      },
    };
  }

  /* ---------------- quiz / practice engine ----------------
     runSet(container, opts):
       opts.mode      'quiz' (scored, pass/fail) or 'practice' (diagnostic, relaxed)
       opts.questions [{q, type:'num'|'mc', a, tol, choices, explain, diagnose(v), unit, from}]
                      For 'mc', a = index into choices (pre-shuffle).
       opts.title     heading text
       opts.passPct   default 90 (quiz only)
       opts.onFinish  function(pct, results)
       opts.onAnswer  function(question, ok)  — fires per answer (Daily 10 nudging)
  */
  function runSet(container, opts) {
    var qs = opts.questions.map(function (q) {
      if (q.type === 'mc') {
        var order = shuffle(q.choices.map(function (_, i) { return i; }));
        return Object.assign({}, q, { order: order });
      }
      return q;
    });
    var i = 0, correct = 0, results = [];
    var isQuiz = opts.mode === 'quiz';
    var passPct = opts.passPct === undefined ? 90 : opts.passPct;

    function render() {
      if (i >= qs.length) return renderEnd();
      var q = qs[i];
      var h = '<div class="q-progress">' + esc(opts.title || (isQuiz ? 'QUIZ' : 'PRACTICE')) +
        ' — QUESTION ' + (i + 1) + ' / ' + qs.length +
        (isQuiz ? '' : ' · running: ' + correct + ' right') +
        (q.from ? ' · from ' + esc(q.from) : '') + '</div>' +
        '<div class="q-text">' + q.q + ' <button class="say" data-read aria-label="read the question aloud">🔊 READ IT</button></div>';
      if (q.type === 'mc') {
        h += '<div class="choices">' + q.order.map(function (ci, k) {
          return '<button data-k="' + k + '">' + String.fromCharCode(65 + k) + ' · ' + q.choices[ci] + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<div class="answer-row"><input type="text" inputmode="decimal" autocomplete="off" ' +
          'placeholder="' + esc(q.unit ? 'answer in ' + q.unit : 'type your answer') + '" aria-label="answer">' +
          '<button class="primary" data-go>CHECK</button></div>';
      }
      /* practice-only help: a where-do-I-start hint and a full walkthrough.
         The quiz stays help-free — that's what practice is for. */
      if (!isQuiz) {
        h += '<div class="btnrow help-row" style="margin-top:10px">' +
          (q.hint ? '<button data-hint>💡 WHERE DO I START?</button>' : '') +
          '<button data-walk>WALK ME THROUGH IT</button></div>' +
          '<div class="hint-slot"></div>';
      }
      h += '<div class="fb-slot"></div>';
      container.innerHTML = h;
      if (q.type === 'mc') {
        container.querySelectorAll('.choices button').forEach(function (b) {
          b.addEventListener('click', function () { answerMC(q, Number(b.dataset.k), b); });
        });
        /* keyboard parity with the numeric input.focus() below — otherwise
           NEXT removes the focused button and keyboard users fall back to <body> */
        container.querySelector('.choices button').focus();
      } else {
        var input = container.querySelector('input');
        var go = function () { answerNum(q, input.value); };
        container.querySelector('[data-go]').addEventListener('click', go);
        input.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          /* preventDefault stops the same keystroke's synthesized keypress from
             clicking the NEXT button we focus in showFeedback — without it the
             feedback screen is skipped entirely on keyboard submits */
          e.preventDefault();
          go();
        });
        input.focus();
      }
      var hintBtn = container.querySelector('[data-hint]');
      if (hintBtn) hintBtn.addEventListener('click', function () {
        hintBtn.disabled = true;
        container.querySelector('.hint-slot').innerHTML =
          '<div class="hintbox"><span class="t">WHERE TO START</span>' + q.hint + '</div>';
      });
      var walkBtn = container.querySelector('[data-walk]');
      if (walkBtn) walkBtn.addEventListener('click', function () { walkThrough(q); });
      var readBtn = container.querySelector('[data-read]');
      if (readBtn) readBtn.addEventListener('click', function () {
        /* numbers read digit-by-digit on purpose — hearing "zero point one eight
           seven" teaches how to READ the numeral without handing over the answer */
        speakText(spokenFromHtml(q.q));
      });
    }

    function sayLineHtml(q) {
      var say = sayAnswer(q);
      if (!say) return '';
      return '<span class="sayline">SAY IT LIKE A MACHINIST: <i>&ldquo;' + say + '&rdquo;</i>' +
        ' <button class="say" data-sayans aria-label="hear it spoken">🔊 HEAR IT</button></span>';
    }
    function wireSay(slot, q) {
      var b = slot.querySelector('[data-sayans]');
      if (b) b.addEventListener('click', function () { speakText(sayAnswer(q)); });
    }

    function stepsBlock(q) {
      return q.steps ? '<div class="steps"><span class="t">THE WHOLE PATH</span>' + q.steps + '</div>' : '';
    }
    function diagHtml(diag) {
      if (!diag) return '';
      if (typeof diag === 'string') return '<span class="diag">Your mistake: ' + diag + '</span>';
      return '<span class="diag"><b>' + diag.label + '.</b>' +
        '<span class="pathrow wrong">Where your number probably came from: <span class="path">' + diag.your + '</span></span>' +
        '<span class="pathrow right">The right path: <span class="path">' + diag.right + '</span></span></span>';
    }
    function freeze() {
      container.querySelectorAll('.choices button, .answer-row button, .answer-row input, [data-hint], [data-walk]')
        .forEach(function (el) { el.disabled = true; });
    }
    function nextBtnHtml(extra) {
      return '<div class="btnrow" style="margin-top:12px">' + (extra || '') +
        '<button class="primary" data-next>' + (i + 1 >= qs.length ? 'SEE RESULT' : 'NEXT QUESTION') + '</button></div>';
    }
    function wireNext(slot) {
      slot.querySelector('[data-next]').addEventListener('click', function () { i++; render(); });
      var retry = slot.querySelector('[data-retry]');
      if (retry) retry.addEventListener('click', function () { render(); });
      (retry || slot.querySelector('[data-next]')).focus();
    }

    /* "I don't know where to start" escape hatch: full worked path, honest miss. */
    function walkThrough(q) {
      if (!q._attempted) {
        q._attempted = true;
        results.push({ q: q, ok: false, walked: true });
        if (opts.onAnswer) opts.onAnswer(q, false);
      }
      freeze();
      var slot = container.querySelector('.fb-slot');
      slot.innerHTML = '<div class="feedback good"><b>Smart ask — here is the whole path.</b> ' +
        (q.explain || '') + stepsBlock(q) + sayLineHtml(q) +
        '<span class="diag">Counted as a miss in the running score — understanding first, the points come back on the next one.</span></div>' +
        nextBtnHtml();
      wireNext(slot);
      wireSay(slot, q);
    }

    function showFeedback(q, ok, userShown, diag, isRetry) {
      var slot = container.querySelector('.fb-slot');
      var h;
      if (ok) {
        h = '<div class="feedback good">' +
          (isRetry ? '<b>There it is — got it on the retry.</b> The first attempt is what counted for the score; the method is what you keep. '
                   : '<b>Right.</b> ') +
          (q.explain || '') + sayLineHtml(q) + '</div>' + nextBtnHtml();
      } else {
        var retryBtn = isQuiz ? '' : '<button data-retry>TRY IT AGAIN</button>';
        h = '<div class="feedback bad"><b>Not this time.</b> You answered <span class="num">' + esc(userShown) + '</span>. ' +
          (q.explain || '') + diagHtml(diag) + stepsBlock(q) + sayLineHtml(q) + '</div>' + nextBtnHtml(retryBtn);
      }
      slot.innerHTML = h;
      freeze();
      wireNext(slot);
      wireSay(slot, q);
    }

    /* only the FIRST attempt on a question counts toward the score */
    function finishAnswer(q, ok, userShown, diagText) {
      var first = !q._attempted;
      if (first) {
        q._attempted = true;
        if (ok) correct++;
        results.push({ q: q, ok: ok });
        if (opts.onAnswer) opts.onAnswer(q, ok);
      }
      showFeedback(q, ok, userShown, diagText, !first);
    }

    function answerMC(q, k, btn) {
      var chosen = q.order[k];
      var ok = chosen === q.a;
      btn.style.background = ok ? 'var(--good-bd)' : 'var(--orange)';
      btn.style.color = '#fff';
      var diag = (!ok && q.diagnose) ? q.diagnose(chosen) : null;
      finishAnswer(q, ok, q.choices[chosen].replace(/<[^>]*>/g, ''), diag);
    }

    function answerNum(q, raw) {
      var v = parseNum(raw);
      if (isNaN(v)) {
        var slot = container.querySelector('.fb-slot');
        slot.innerHTML = '<div class="feedback bad"><b>Type a number.</b> Decimals like 0.375 or fractions like 3/8 both work. Use a leading − for negatives.</div>';
        return;
      }
      var tol = q.tol === undefined ? 0.0005 : q.tol;
      var ok = Math.abs(v - q.a) <= tol;
      var diag = (!ok && q.diagnose) ? q.diagnose(v) : null;
      finishAnswer(q, ok, raw, diag);
    }

    function renderEnd() {
      var pct = Math.round(100 * correct / qs.length);
      var passed = isQuiz && pct >= passPct;
      var h = '<div class="result-banner">' +
        '<div class="big ' + (isQuiz ? (passed ? 'pass' : 'fail') : 'pass') + '">' + correct + ' / ' + qs.length + '</div>';
      if (isQuiz) {
        h += '<p>' + pct + '% — ' + (passed
          ? 'passed. You needed ' + passPct + '% and you got it.'
          : 'you need ' + passPct + '% (' + Math.ceil(passPct / 100 * qs.length) + ' right) to pass this module. Replay the playground, then try again — the questions change every attempt.') + '</p>';
      } else {
        h += '<p>Practice done. Misses below are the ones to sit with — each shows the exact mistake it caught.</p>';
      }
      var misses = results.filter(function (r) { return !r.ok; });
      if (misses.length) {
        h += '<div style="text-align:left">' + misses.map(function (r) {
          return '<div class="feedback bad" style="margin-top:8px"><b>' + (r.walked ? 'Walked through:' : 'Missed:') + '</b> ' + r.q.q +
            '<br>' + (r.q.explain || '') + '</div>';
        }).join('') + '</div>';
      }
      h += '</div>';
      container.innerHTML = h;
      if (opts.onFinish) opts.onFinish(pct, results);
    }

    render();
  }

  /* ---------------- Daily 10 question banks ----------------
     One generator per built module; each call returns a fresh question object.
     Modules 2–10 add theirs here as they get built. */
  var BANKS = {};

  BANKS.m1 = function () {
    var kind = pick(['f2d', 'f2d', 'thou', 'compare', 'd2f']);
    var pool = [[1,2],[1,4],[3,4],[1,8],[3,8],[5,8],[7,8],[1,16],[3,16],[5,16],[7,16],[9,16],[11,16],[13,16],[15,16],[1,32],[3,32],[5,32],[7,32],[9,32],[15,32],[21,32],[27,32],[31,32],[1,64],[3,64],[5,64],[9,64],[17,64],[33,64],[63,64]];
    if (kind === 'f2d') {
      var f = pick(pool), dec = f[0] / f[1];
      return { type: 'num', a: dec, tol: 0.0005, from: 'Module 1',
        q: 'Convert <span class="num">' + f[0] + '/' + f[1] + '</span> to a decimal.',
        explain: f[0] + ' ÷ ' + f[1] + ' = <span class="num">' + fmtExact(dec) + '</span>.',
        hint: 'A fraction IS a division: read ' + f[0] + '/' + f[1] + ' as "' + f[0] + ' divided by ' + f[1] + '". Top goes in first.',
        steps: '1 · ' + f[0] + '/' + f[1] + ' = <span class="num">' + f[0] + ' ÷ ' + f[1] + '</span><br>' +
          '2 · Divide: <span class="res">' + fmtExact(dec) + '</span>',
        diagnose: m1DiagF2D(f[0], f[1], dec) };
    }
    if (kind === 'thou') {
      var v = pick([0.062, 0.125, 0.250, 0.375, 0.437, 0.500, 0.750, 0.031, 0.812]);
      var th = Math.round(v * 1000);
      return { type: 'num', a: th, tol: 0.6, unit: 'thou', from: 'Module 1',
        q: 'How many <b>thou</b> is <span class="num">' + fmtExact(v, 3) + '"</span>?',
        explain: 'One thou = 0.001". Multiply by 1000: ' + fmtExact(v, 3) + ' × 1000 = <span class="num">' + th + '</span> thou.',
        hint: 'A thou is 0.001". Slide the decimal point three places to the right — done.',
        steps: '1 · thou = inches × 1000<br>' +
          '2 · <span class="num">' + fmtExact(v, 3) + ' → ' + (v * 10).toFixed(2) + ' → ' + (v * 100).toFixed(1) + ' → ' + th + '</span><br>' +
          '3 · Answer: <span class="res">' + th + ' thou</span>',
        diagnose: function (u) {
          if (Math.abs(u - v) < 0.002) return { label: 'Units mix-up',
            your: 'you handed the inches back: ' + fmtExact(v, 3),
            right: fmtExact(v, 3) + ' × 1000 = ' + th + ' thou' };
          if (Math.abs(u - v * 100) < 1 || Math.abs(u - v * 10000) < 1) return { label: 'Decimal-place slip',
            your: 'the point moved, but not exactly three places → ' + u,
            right: fmtExact(v, 3) + ' × 1000 = ' + th + ' — three slides exactly' };
          return null;
        } };
    }
    if (kind === 'compare') {
      var f2 = pick(pool); var dec2 = f2[0] / f2[1];
      var off = pick([0.004, -0.004, 0.007, -0.007]);
      var other = Math.round((dec2 + off) * 10000) / 10000;
      var bigger = dec2 > other ? 0 : 1;
      return { type: 'mc', a: bigger, from: 'Module 1',
        q: 'Which is <b>larger</b>?',
        choices: [fracStr(f2[0], f2[1]), fmtExact(other) + '"'],
        explain: fracStr(f2[0], f2[1]) + ' = ' + fmtExact(dec2) + '. Compare: ' + fmtExact(dec2) + ' vs ' + fmtExact(other) + '.' };
    }
    /* d2f: decimal to nearest fraction, multiple choice — neighbor-mark distractors */
    var f3 = pick(pool); var n3 = f3[0], d3 = f3[1]; var dec3 = n3 / d3;
    var r = reduceFrac(n3, d3);
    var correct = fracStr(r[0], r[1]);
    var cands = [[n3 - 1, d3], [n3 + 1, d3], [2 * n3 - 1, 2 * d3], [2 * n3 + 1, 2 * d3], [2 * n3 - 3, 2 * d3], [2 * n3 + 3, 2 * d3]];
    var seen = {}; seen[correct] = true;
    var choices = [correct];
    for (var ci = 0; ci < cands.length && choices.length < 4; ci++) {
      var cn = cands[ci][0], cd = cands[ci][1];
      if (cn <= 0 || cn >= cd) continue;
      var cs = fracStr(cn, cd);
      if (!seen[cs]) { seen[cs] = true; choices.push(cs); }
    }
    return { type: 'mc', a: 0, from: 'Module 1',
      q: '<span class="num">' + fmtExact(dec3) + '"</span> is which fraction?',
      choices: choices,
      explain: correct + ' = ' + r[0] + ' ÷ ' + r[1] + ' = ' + fmtExact(dec3) + '.',
      diagnose: function () {
        return 'off by a neighboring mark — divide it out and compare decimals.';
      } };
  };

  function m1DiagF2D(n, d, dec) {
    return function (v) {
      if (Math.abs(v - d / n) <= 0.002 && n !== d) return { label: 'Inverted fraction',
        your: d + ' ÷ ' + n + ' = ' + fmtExact(d / n) + ' — bottom ÷ top',
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) + ' — top ÷ bottom, always' };
      if (Math.abs(v - dec * 10) <= 0.005 || Math.abs(v - dec / 10) <= 0.005) return { label: 'Decimal-place slip',
        your: 'right digits, wrong spot: ' + fmtExact(v),
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
      if (Math.abs(v - dec) <= 0.005) return { label: 'Rounded too early',
        your: fmtExact(v) + ' — cut short',
        right: 'carry it out: ' + n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
      return { label: 'Wrong operation',
        your: 'whatever produced ' + fmtExact(v) + ' was not top ÷ bottom',
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
    };
  }

  /* Daily 10: pull from all unlocked, built modules with a bank */
  function daily10Questions() {
    var eligible = MODULES.filter(function (m) { return m.built && isUnlocked(m.id) && BANKS[m.id]; });
    if (!eligible.length) return [];
    var qs = [];
    for (var k = 0; k < 10; k++) {
      var m = eligible[k % eligible.length];
      var q = BANKS[m.id]();
      q.moduleId = m.id;
      qs.push(q);
    }
    return shuffle(qs);
  }

  /* ---------------- module page chrome ----------------
     modulePage(id, {explainer, playground, practiceQs(), quizQs()})
     Builds the 4-part tab structure into #mmt-root and wires pass/unlock. */
  function modulePage(id, parts) {
    var mod = MODULES[moduleIndex(id)];
    var root = document.getElementById('mmt-root');
    var TABS = [
      ['1', 'EXPLAINER'], ['2', 'PLAYGROUND'], ['3', 'PRACTICE'], ['4', 'QUIZ'],
    ];
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
        c.className = 'card'; c.innerHTML = '<h2>Practice — stuck? tap WHERE DO I START · mistakes get named</h2><div class="body"></div>';
        panes.appendChild(c);
        runSet(c.querySelector('.body'), { mode: 'practice', title: 'PRACTICE', questions: parts.practiceQs() });
      }
      if (k === 3) {
        var c2 = document.createElement('div');
        c2.className = 'card'; c2.innerHTML = '<h2>Quiz — 90% marks this module done</h2><div class="body"></div>';
        panes.appendChild(c2);
        runSet(c2.querySelector('.body'), {
          mode: 'quiz', title: 'QUIZ', questions: parts.quizQs(), passPct: 90,
          onFinish: function (pct) {
            recordQuiz(id, pct);
            var r = rec(id);
            var next = MODULES[moduleIndex(id) + 1];
            var extra = document.createElement('div');
            extra.className = 'callout' + (pct >= 90 ? '' : ' warn');
            extra.innerHTML = pct >= 90
              ? '<b>Module ' + mod.n + ' complete.</b> ' +
                (next ? (next.built ? 'Module ' + next.n + ' — ' + esc(next.title) + ' — is now unlocked on the hub.'
                                    : 'Module ' + next.n + ' is unlocked and will appear on the hub as soon as it is built.')
                      : 'That was the last module.') +
                ' Best score: ' + r.best + '%. <a href="../index.html">Back to the hub →</a>'
              : 'Best so far: ' + r.best + '%. Scores only ever go up — replay any part and quiz again. ' +
                '<a href="../index.html">Hub →</a>';
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
  window.MMT = {
    MODULES: MODULES, FACTS: FACTS, BANKS: BANKS,
    state: state, save: save, rec: rec,
    recordQuiz: recordQuiz, nudge: nudge, isUnlocked: isUnlocked,
    fmt: fmt, fmtExact: fmtExact, signed: signed,
    intWords: intWords, digitWords: digitWords, sayMeasure: sayMeasure,
    sayFraction: sayFraction, spokenFromHtml: spokenFromHtml, speakText: speakText,
    gcd: gcd, reduceFrac: reduceFrac, fracStr: fracStr,
    parseNum: parseNum, shuffle: shuffle, pick: pick, esc: esc,
    dro: dro, runSet: runSet, daily10Questions: daily10Questions,
    modulePage: modulePage,
  };
})();
