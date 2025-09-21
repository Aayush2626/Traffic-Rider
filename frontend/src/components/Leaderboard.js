const express = require("express");
const router = express.Router();

let scores = []; // in-memory leaderboard

// Save a score
router.post("/score", (req, res) => {
  const { playerName, points } = req.body;
  if (!playerName || typeof points !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }
  scores.push({ id: Date.now(), playerName, points });
  scores.sort((a, b) => b.points - a.points);
  if (scores.length > 10) scores.length = 10;
  res.json({ success: true });
});

// Get leaderboard
router.get("/leaderboard", (req, res) => {
  res.json(scores);
});

module.exports = router;
