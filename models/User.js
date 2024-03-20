const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  code: String,
  resetToken: String,
  tokenExpiry: Date,
  userType: {
    type: String,
    enum: ['professional', 'customer'], // Only allows 'professional' or 'customer
  },
});

module.exports = mongoose.model('User', userSchema);
