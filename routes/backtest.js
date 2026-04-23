const express = require("express");
const router = express.Router();

const { runBacktest } = require("../lib/learningEngine");

/**
 * ===============================
 * BACKTEST ROUTE (SAFE + STABLE)
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const results = await runBacktest?.() || [];

    return res.status(200).json({
      success: true,
      count: Array.isArray(results) ? results.length : 0,
      data: results
    });

  } catch (error) {
    console.error("Backtest error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Backtest failed",
      error: error.message
    });
  }
});

module.exports = router;
