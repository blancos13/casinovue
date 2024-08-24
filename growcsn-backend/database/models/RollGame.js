const mongoose = require('mongoose');

const rollGameSchema = new mongoose.Schema({
    outcome: { type: Number },
    fair: {
        seed: { type: mongoose.Schema.ObjectId, ref: 'RollSeed' }
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Reverse populate with virtuals
rollGameSchema.virtual('bets', {
    ref: 'RollBet',
    localField: '_id',
    foreignField: 'game',
    justOne: false
});

module.exports = mongoose.model('RollGame', rollGameSchema);
