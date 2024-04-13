// Load required modules
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');


const authRoutes = require('./routes/authRoutes'); // Authentication routes
const Message = require('./models/messageSchema'); // Schema for message data
const User = require('./models/User');             // Schema for user data

// Initialize Express application
const app = express();


// Connect to MongoDB using a connection string
mongoose.connect('mongodb+srv://earthh17:zS4njrU9MrKNNpVN@cluster0.wp530qf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');  // Log success message on successful connection
    })

// Setup HTTP server and integrate Socket.IO
const server = require('http').Server(app);
const io = socketIo(server); // Initialize Socket.IO with the server


// Define the behavior for client connections using Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id); // Log new connection with socket ID

    // Register user's email and associate it with a socket ID
    socket.on('register', async ({ email }) => {
        await User.findOneAndUpdate(
            { email },
            { socketId: socket.id },
            { upsert: true, new: true }  // Upsert ensures creation if it doesn't exist
        );

        // Retrieve and send chat history to the client
        Message.find({ $or: [{ senderEmail: email }, { receiverEmail: email }] })
            .sort('timestamp')
            .exec((err, messages) => {
                if (!err) {
                    socket.emit('chat_history', messages);
                } else {
                    console.error('Error retrieving chat history:', err);
                }
            });
    });

    // Handle sending of private messages
    socket.on('private_message', async ({ senderEmail, receiverEmail, message }) => {
        const newMessage = new Message({
            senderEmail,
            receiverEmail,
            message
        });
        await newMessage.save();

        // Retrieve the receiver's socket ID and forward the message
        const receiver = await User.findOne({ email: receiverEmail });
        if (receiver && receiver.socketId) {
            io.to(receiver.socketId).emit('receive_message', newMessage);
        }
    });

    // Clean up when a client disconnects
    socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);

        // Remove the socket ID from the user document
        try {
            await User.findOneAndUpdate(
                { socketId: socket.id },
                { $unset: { socketId: 1 } } // This unsets the socketId field
            );
            console.log(`Socket ID ${socket.id} has been removed from the user's document.`);
        } catch (err) {
            console.error('Error on disconnect:', err);
        }
    });
})

    
    // Middlewares for parsing JSON and handling CORS
    app.use(express.json());
    app.use(require('cors')());

    // Set up routing for authentication and static files
    app.use('/auth', authRoutes); // Authentication routes
    app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

    // Start the server on port 3001
    app.listen(3001, () => console.log('Server started on http://localhost:3001'));
