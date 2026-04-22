const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/history.json");

/**
 * ===============================
 * 1. LOAD / SAVE DATA
 * ===============================
 */
function loadHistory() {
  if (!fs.existsSync(DATA_FILE)) return [];

  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function saveHistory(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * ===============================
 * 2. STORE PREDICTION
 * ===============================
 */
function storePrediction(match, prediction) {
  const history = loadHistory();

  history.push({
    matchId: `${match.homeTeam}_${match.awayTeam}_${match.date}`,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    date: match.date,
    prediction,
    result: null // filled later
  });

  saveHistory(history);
}

/**
 * ===============================
 * 3. UPDATE RESULT
 * ===============================
 */
function updateResult(matchId, result) {
  const history = loadHistory();

  const item = history.find(m => m.matchId === matchId);
  if (item) {
    item.result = result; // "HOME" | "DRAW" | "AWAY"
  }

  saveHistory(history);
}

/**
 * ===============================
 * 4. CALCULATE ACCURACY
 * ===============================
 */
function calculateAccuracy(history) {
  let correct = 0;
  let total = 0;

  history.forEach(m => {
    if (!m.result) return;

    const pred = getPredictionLabel(m.prediction);

    if (pred === m.result) correct++;
    total++;
  });

  return total === 0 ? 0 : correct / total;
}

function getPredictionLabel(pred) {
  const max = Math.max(pred.home, pred.draw, pred.away);

  if (max === pred.home) return "HOME";
  if (max === pred.draw) return "DRAW";
  return "AWAY";
}

/**
 * ===============================
 * 5. ROI CALCULATION
 * ===============================
 */
function calculateROI(history) {
  let profit = 0;
  let bets = 0;

  history.forEach(m => {
    if (!m.result || !m.odds) return;

    const pred = getPredictionLabel(m.prediction);

    bets++;

    if (pred === m.result) {
      profit += m.odds[pred.toLowerCase()] - 1;
    } else {
      profit -= 1;
    }
  });

  return bets === 0 ? 0 : profit / bets;
}

/**
 * ===============================
 * 6. MODEL PERFORMANCE TRACKING
 * ===============================
 */
function evaluateModels(history) {
  const scores = {
    poisson: { correct: 0, total: 0 },
    elo: { correct: 0, total: 0 },
    form: { correct: 0, total: 0 },
    xg: { correct: 0, total: 0 }
  };

  history.forEach(m => {
    if (!m.result || !m.models) return;

    Object.keys(scores).forEach(model => {
      const pred = getPredictionLabel(m.models[model]);

      if (pred === m.result) scores[model].correct++;
      scores[model].total++;
    });
  });

  return scores;
}

/**
 * ===============================
 * 7. UPDATE MODEL WEIGHTS
 * ===============================
 */
function updateWeights(modelScores) {
  const weights = [];

  Object.values(modelScores).forEach(m => {
    const acc = m.total === 0 ? 0.25 : m.correct / m.total;
    weights.push(acc);
  });

  // normalize
  const sum = weights.reduce((a, b) => a + b, 0);

  return weights.map(w => w / sum);
}

/**
 * ===============================
 * 8. BACKTEST ENGINE
 * ===============================
 */
function runBacktest() {
  const history = loadHistory();

  const accuracy = calculateAccuracy(history);
  const roi = calculateROI(history);
  const modelScores = evaluateModels(history);
  const weights = updateWeights(modelScores);

  return {
    accuracy,
    roi,
    modelScores,
    newWeights: weights
  };
}

/**
 * ===============================
 * 9. AUTO-LEARNING PIPELINE
 * ===============================
 */
function learningCycle() {
  const results = runBacktest();

  console.log("📊 Accuracy:", results.accuracy);
  console.log("💰 ROI:", results.roi);
  console.log("⚙️ New Weights:", results.newWeights);

  return results.newWeights;
}

module.exports = {
  storePrediction,
  updateResult,
  runBacktest,
  learningCycle
};
