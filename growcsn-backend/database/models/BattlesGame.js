const mongoose = require('mongoose');

const battlesGameSchema = new mongoose.Schema({
    amount: { type: Number },
    playerCount: { type: Number },
    mode: { type: String },
    boxes: [
        {
            box: { type: mongoose.Schema.ObjectId, ref: 'Box' },
            count: { type: Number }
        }
    ],
    options: {
        levelMin: { type: Number },
        funding: { type: Number },
        cursed: { type: Boolean },
        terminal: { type: Boolean },
        private: { type: Boolean },
        affiliateOnly: { type: Boolean }
    },
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
battlesGameSchema.virtual('bets', {
    ref: 'BattlesBet',
    localField: '_id',
    foreignField: 'game',
    justOne: false
});

module.exports = mongoose.model('BattlesGame', battlesGameSchema);