const express = require("express");
const router = express.Router();

const { runBacktest } = require("../lib/learningEngine");

router.get("/", (req, res) => {
  const results = runBacktest();
  res.json(results);
});

module.exports = router;
