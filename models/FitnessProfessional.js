const mongoose = require('mongoose');

const fitnessProfessionalSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  code: String,
  specialitytype: String,
  gender: String,
  location: String
});

module.exports = mongoose.model('FitnessProfessional', fitnessProfessionalSchema);
