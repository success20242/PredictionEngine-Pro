const express = require("express");
const router = express.Router();

const { fetchReliableMatches } = require("../lib/ingestion");
const { runPredictions } = require("../lib/predictionEngine");

router.get("/", async (req, res) => {
  try {
    const matches = await fetchReliableMatches();

    const predictions = runPredictions(matches);

    res.json({
      updatedAt: new Date(),
      count: predictions.length,
      data: predictions
    });

  } catch (err) {
    res.status(500).json({
      error: "Prediction engine failed",
      details: err.message
    });
  }
});

module.exports = router;
