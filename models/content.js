// models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  mode: String,
  type: String,
  date: Date,
  description: String,
  instructor: String,
  videoId: String
});

module.exports = mongoose.model('Content', contentSchema);
