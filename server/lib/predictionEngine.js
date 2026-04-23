const { storePrediction } = require("./learningEngine");

/**
 * ===============================
 * POISSON MODEL
 * ===============================
 */
function poisson(lambda, k) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function poissonModel(homeXG, awayXG) {
  return {
    homeWin: poisson(homeXG, 1),
    draw: 0.25,
    awayWin: poisson(awayXG, 1)
  };
}

/**
 * ===============================
 * ELO MODEL
 * ===============================
 */
function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function eloModel(homeRating, awayRating) {
  const home = expectedScore(homeRating, awayRating);
  const away = expectedScore(awayRating, homeRating);

  return {
    homeWin: home,
    draw: 0.2,
    awayWin: away
  };
}

/**
 * ===============================
 * FORM MODEL
 * ===============================
 */
function formScore(results = []) {
  if (!results.length) return 0.5;

  const score = results.reduce((acc, r) => {
    if (r === "W") return acc + 3;
    if (r === "D") return acc + 1;
    return acc;
  }, 0);

  return score / (results.length * 3);
}

function formModel(homeForm, awayForm) {
  return {
    homeWin: formScore(homeForm),
    draw: 0.2,
    awayWin: formScore(awayForm)
  };
}

/**
 * ===============================
 * xG MODEL
 * ===============================
 */
function xgProxy(goals, shots) {
  if (!shots || shots === 0) return 1.2;
  return (goals / shots) * 10;
}

function xgModel(homeStats, awayStats) {
  const h = xgProxy(homeStats.goals, homeStats.shots);
  const a = xgProxy(awayStats.goals, awayStats.shots);

  return {
    homeWin: h / (h + a),
    draw: 0.2,
    awayWin: a / (h + a)
  };
}

/**
 * ===============================
 * ENSEMBLE ENGINE
 * ===============================
 */
function ensemble(models, weights) {
  let result = { home: 0, draw: 0, away: 0 };

  models.forEach((m, i) => {
    result.home += m.homeWin * weights[i];
    result.draw += m.draw * weights[i];
    result.away += m.awayWin * weights[i];
  });

  return result;
}

/**
 * ===============================
 * NORMALIZE
 * ===============================
 */
function normalize(p) {
  const total = p.home + p.draw + p.away;

  return {
    home: p.home / total,
    draw: p.draw / total,
    away: p.away / total
  };
}

/**
 * ===============================
 * VALUE BET DETECTION
 * ===============================
 */
function detectValue(prob, odds) {
  if (!odds) return "NO_DATA";

  const implied = 1 / odds;

  if (prob > implied + 0.15) return "STRONG";
  if (prob > implied + 0.05) return "MEDIUM";
  return "AVOID";
}

/**
 * ===============================
 * CONFIDENCE SCORE
 * ===============================
 */
function confidenceScore(p) {
  const max = Math.max(p.home, p.draw, p.away);

  if (max > 0.65) return "HIGH";
  if (max > 0.5) return "MEDIUM";
  return "LOW";
}

/**
 * ===============================
 * MAIN PREDICTION FUNCTION (FIXED)
 * ===============================
 */
function predictMatch(match) {
  const homeRating = match.homeRating || 1500;
  const awayRating = match.awayRating || 1500;

  const homeForm = match.homeForm || ["W", "D", "L"];
  const awayForm = match.awayForm || ["L", "D", "W"];

  const homeStats = match.homeStats || { goals: 5, shots: 20 };
  const awayStats = match.awayStats || { goals: 4, shots: 18 };

  // ✅ FIXED: dynamic Poisson
  const m1 = poissonModel(
    homeStats.goals ? homeStats.goals / 3 : 1.3,
    awayStats.goals ? awayStats.goals / 3 : 1.1
  );

  // ✅ Elo
  const m2 = eloModel(homeRating, awayRating);

  // ✅ Form
  const m3 = formModel(homeForm, awayForm);

  // ✅ xG
  const m4 = xgModel(homeStats, awayStats);

  /**
   * 🔥 FIXED WEIGHTS (dynamic strength difference)
   */
  const ratingDiff = (homeRating - awayRating) / 5000;

  const weights = [
    0.35 + ratingDiff,
    0.25,
    0.2,
    0.2
  ];

  const combined = ensemble([m1, m2, m3, m4], weights);
  const normalized = normalize(combined);

  const odds = match.odds || {
    home: 2.0,
    draw: 3.2,
    away: 3.5
  };

  const output = {
    ...match,
    prediction: normalized,
    confidence: confidenceScore(normalized),
    value: {
      home: detectValue(normalized.home, odds.home),
      draw: detectValue(normalized.draw, odds.draw),
      away: detectValue(normalized.away, odds.away)
    }
  };

  // ✅ SAFE learning hook
  try {
    if (typeof storePrediction === "function") {
      storePrediction(match, normalized);
    }
  } catch (e) {
    console.warn("Learning engine error:", e.message);
  }

  return output;
}

/**
 * ===============================
 * BATCH PROCESSING
 * ===============================
 */
function runPredictions(matches) {
  return matches.map(predictMatch);
}

module.exports = { runPredictions };
