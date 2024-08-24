const mongoose = require('mongoose');

const rainSchema = new mongoose.Schema({
    amount: { type: Number },
    participants: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    creator: { type: mongoose.Schema.ObjectId, ref: 'User' },
    type: { type: String },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rain',  rainSchema);
