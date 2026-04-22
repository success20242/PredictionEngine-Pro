const express = require("express");
const router = express.Router();

const { fetchMatches } = require("../lib/ingestion");
const consensus = require("../lib/consensus");
const validate = require("../lib/validator");

router.get("/", async (req, res) => {
  try {
    const raw = await fetchMatches();
    const merged = consensus(raw);

    const clean = merged.filter(validate);

    res.json(clean);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
