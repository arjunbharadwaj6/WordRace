const express = require('express');
const router = express.Router();
const Score = require('../models/score');

router.get('/', async (req, res) => {
  try {
    const scores = await Score.find();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const userStats = await Score.find({ email: email }).sort({ score: -1 });
    if (userStats.length > 0) {
      const numTimesPlayed = userStats.length;
      const totalScore = userStats.reduce((acc, score) => acc + score.score, 0);
      const avgScore = totalScore / numTimesPlayed;
      const highestScore = userStats[0].score;
      const lowestScore = userStats[userStats.length - 1].score;
      const maxLevel = Math.max(...userStats.map(score => score.level));

      const stats = {
        numTimesPlayed,
        avgScore,
        highestScore,
        lowestScore,
        maxLevel,
        scores: userStats
      };

      res.json(stats);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


module.exports = router;


router.post('/', async (req, res) => {
  const score = new Score({
    username: req.body.username,
    email: req.body.email,
    score: req.body.score,
    level: req.body.level
  });

  try {
    const newScore = await score.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
