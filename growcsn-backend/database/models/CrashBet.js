const mongoose = require('mongoose');

const crashBetSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    autoCashout: { type: Number },
    game: { type: mongoose.Schema.ObjectId, ref: 'CrashGame' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrashBet', crashBetSchema);
