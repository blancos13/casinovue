const mongoose = require('mongoose');

const duelsBetSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    roll: { type: Number },
    game: { type: mongoose.Schema.ObjectId, ref: 'DuelsGame' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    bot: { type: Boolean },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DuelsBet', duelsBetSchema);
