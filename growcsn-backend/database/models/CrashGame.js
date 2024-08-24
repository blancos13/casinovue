const mongoose = require('mongoose');

const crashGameSchema = new mongoose.Schema({
    outcome: { type: Number },
    fair: {
        seed: { type: mongoose.Schema.ObjectId, ref: 'CrashSeed' }
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Reverse populate with virtuals
crashGameSchema.virtual('bets', {
    ref: 'CrashBet',
    localField: '_id',
    foreignField: 'game',
    justOne: false
});

module.exports = mongoose.model('CrashGame', crashGameSchema);
