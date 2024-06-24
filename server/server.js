const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Score = require('./models/score');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const scoresRouter = require('./routes/scores');
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connnection established successfully");
});

app.use(cors());
app.use(express.json());

app.use("/scores", scoresRouter)

app.get("/leaderboard", async (req, res) => {
  try {
    const scores = await Score.aggregate([
      {
        $sort: { score: -1 }
      },
      {
        $group: {
          _id: "$email",
          highestScore: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$highestScore" }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
