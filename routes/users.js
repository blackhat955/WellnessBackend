// routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.get('/jeetkatariya', (req, res) => {
//   res.send('Welcome TO WellTrack360!')
// })

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  // Implement login logic here
});

module.exports = router;
