const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({

  fitnessProfessionalEmail: {
    type: String,
    ref: 'FitnessProfessional'
  },
  userEmail:{
    type: String,
    ref:'User'
  },
  typeofWorkoutplan:String,    
  exercises: [{
    name: String,
    description: String,
    sets: Number,
    reps: Number,
    duration: String // e.g. "30 seconds", "1 minute", etc.
  }],
  startDate: Date,
  endDate: Date,
  goal: String
  // Add any additional fields specific to the workout plan if needed
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

