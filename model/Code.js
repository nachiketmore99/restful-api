const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    project_name: {
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
	code: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Code', codeSchema);