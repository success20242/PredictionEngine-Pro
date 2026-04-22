const express = require("express");
const router = express.Router();
const { exportCSV } = require("../lib/reportExporter");

router.get("/csv", (req, res) => {
  exportCSV([{ team: "A", prob: 0.6 }]);
  res.send("CSV Generated");
});

module.exports = router;
