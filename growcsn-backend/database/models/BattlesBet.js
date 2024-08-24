const mongoose = require('mongoose');

const battlesBetSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    outcomes: [{ type: Number }],
    slot: { type: Number },
    game: { type: mongoose.Schema.ObjectId, ref: 'BattlesGame' },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    bot: { type: Boolean },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BattlesBet', battlesBetSchema);