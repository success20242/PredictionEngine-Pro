const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express(); // 🔥 THIS WAS MISSING

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Prediction Engine API is running 🚀" });
});

// Routes (add yours here later)
const predictionsRoute = require("./routes/predictions");
app.use("/api/predictions", predictionsRoute);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
