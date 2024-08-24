const mongoose = require('mongoose');

const blackjackGameSchema = new mongoose.Schema({
    deck: [
        {
            rank: { type: String },
            suit: { type: String }
        }
    ],
    dealerCards: [
        {
            rank: { type: String },
            suit: { type: String }
        }
    ],
    fair: {
        seedServer: { type: String },
        hash: { type: String },
        seedPublic: { type: String },
        blockId: { type: String }
    },
    table: { type: Number },
    type: { type: String },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Reverse populate with virtuals
blackjackGameSchema.virtual('bets', {
    ref: 'BlackjackBet',
    localField: '_id',
    foreignField: 'game',
    justOne: false
});

module.exports = mongoose.model('BlackjackGame', blackjackGameSchema);
