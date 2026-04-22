const express = require("express");
const router = express.Router();

const { updateResult } = require("../lib/learningEngine");

router.post("/", (req, res) => {
  const { matchId, result } = req.body;

  updateResult(matchId, result);

  res.json({ status: "updated" });
});

module.exports = router;
