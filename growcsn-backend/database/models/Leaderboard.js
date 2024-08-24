const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    winners: [
        {
            prize: { type: Number },
            points: { type: Number },
            user: { type: mongoose.Schema.ObjectId, ref: 'User' }
        }
    ],
    duration: { type: Number },
    type: { type: String },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leaderboard',  leaderboardSchema);