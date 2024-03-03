// // Import required modules
// const express = require('express');

// const dotenv = require('dotenv').config()
// const cors = require('cors')

// const mongoose = require('mongoose')

// //Database connection 
// mongoose.connect(process.env.MONGO_URL)
// .then(() => console.log('Database Connected'))
// .catch((err) => console.log('Database is not Connected', err))

// // Create an instance of Express
// const app = express();
// // const workoutRoutes = require('./routes/workouts')

// // Middleware
// app.use(express.json())  

// app.use((req, res, next) => {
//     console.log(req.path, req.method)
//     next()
// })

// // Define routes
// app.use('/', require('./routes/authRoutes'))

// // Start the server
// const port = 8001;


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// Bodyparser Middleware
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://jeetkatariya01970:Jeet%401309%23@cluster0.nambfb0.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
