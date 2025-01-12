const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  username: { type: 'string', required: true },
  email: { type: 'string', required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
