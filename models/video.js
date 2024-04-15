const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['MP4', 'AVI'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Home', 'Outdoor', 'Gym'],
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: String, // You can adjust this based on how you store the file path or URL
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  experience: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },

});

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };

