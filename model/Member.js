const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
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
    session_name: {
        type: String,
        required: true,
        max: 255
    },
    session_id: {
        type: String,
        required: true,
        max: 255
    },
    admin: {
        type: String,
        required: true,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Member', memberSchema);