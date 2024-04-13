const mongoose = require('mongoose');

// Define a new schema for a fitness professional
const fitnessProfessionalSchema = new mongoose.Schema({
  email: String,            // Email address of the fitness professional, used as login or contact
  password: String,         // Encrypted password for login authentication
  firstname: String,        // First name of the fitness professional
  lastname: String,         // Last name of the fitness professional
  code: String,             // A unique identifier or code for the professional
  specialitytype: String,   // Type of speciality, e.g., nutritionist, personal trainer
  gender: String,           // Gender of the fitness professional
  location: String          // Geographical location or address of the professional
});

// Export the schema as a model named 'FitnessProfessional'
module.exports = mongoose.model('FitnessProfessional', fitnessProfessionalSchema);
