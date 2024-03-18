const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  plan_id: { type: String, unique: true },
  name: String,
  description: String,
  duration: String,
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      time: String,
      distance: String
    }
  ],
  youtube_links: [String],
  created_at: Date,
  fitness_professionals: [
    {
      name: String,
      email: String,
      created_at: Date
    }
  ]
});

const WorkoutPlanTable = mongoose.model('WorkoutPlanTable', workoutPlanSchema);

module.exports = WorkoutPlanTable;
