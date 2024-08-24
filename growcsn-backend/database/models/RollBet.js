const mongoose = require('mongoose');

const rollBetSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    game: { type: mongoose.Schema.ObjectId, ref: 'RollGame' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RollBet', rollBetSchema);
