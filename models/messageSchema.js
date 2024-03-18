const mongoose = require('mongoose');
const { Schema } = mongoose;


// Message schema and model
const MessageSchema = new mongoose.Schema({
    senderEmail: String,
    receiverEmail: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
