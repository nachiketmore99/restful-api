const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    session_name: {
        type: String,
        required: true,
        max: 255
    },
    username: {
        type: String,
        required: true,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    session_id: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema);