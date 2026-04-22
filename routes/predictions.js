const express = require("express");
const router = express.Router();

const { fetchReliableMatches } = require("../lib/ingestion");
const { runPredictions } = require("../lib/predictionEngine");

router.get("/", async (req, res) => {
  try {
    const matches = await fetchReliableMatches();
    const predictions = runPredictions(matches);

    res.json(predictions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
