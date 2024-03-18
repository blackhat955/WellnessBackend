const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');


const authRoutes = require('./routes/authRoutes');
const Message = require('./models/messageSchema');
const User = require('./models/User');

const app = express();


// MongoDB setup
mongoose.connect('mongodb+srv://earthh17:zS4njrU9MrKNNpVN@cluster0.wp530qf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })

// Create a server from the Express app
const server = require('http').Server(app);
const io = socketIo(server);


// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Register user's email and associate with socket ID
    socket.on('register', async ({ email }) => {
        await User.findOneAndUpdate(
            { email },
            { socketId: socket.id },
            { upsert: true, new: true }
        );

        // Retrieve and send chat history related to the user's email
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

    socket.on('private_message', async ({ senderEmail, receiverEmail, message }) => {
        const newMessage = new Message({
            senderEmail,
            receiverEmail,
            message
        });
        await newMessage.save();

        // Retrieve the receiver's socket ID by their email
        const receiver = await User.findOne({ email: receiverEmail });
        if (receiver && receiver.socketId) {
            io.to(receiver.socketId).emit('receive_message', newMessage);
        }
    });

    socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id);

        // Find the user by socket ID and update the document by removing the socket ID
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


    app.use(express.json());
    app.use(require('cors')());

    app.use('/auth', authRoutes); // Mount the auth routes

    app.use('/uploads', express.static('uploads'));

    app.listen(3001, () => console.log('Server started on http://localhost:3001'));
