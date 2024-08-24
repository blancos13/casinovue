const mongoose = require('mongoose');

const duelsGameSchema = new mongoose.Schema({
    amount: { type: Number },
    playerCount: { type: Number },
    winner: { type: mongoose.Schema.ObjectId, ref: 'DuelsBet' },
    fair: {
        seedServer: { type: String },
        hash: { type: String },
        seedPublic: { type: String },
        blockId: { type: String }
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Reverse populate with virtuals
duelsGameSchema.virtual('bets', {
    ref: 'DuelsBet',
    localField: '_id',
    foreignField: 'game',
    justOne: false
});

module.exports = mongoose.model('DuelsGame', duelsGameSchema);
