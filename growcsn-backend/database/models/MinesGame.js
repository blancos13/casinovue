const mongoose = require('mongoose');

const minesGameSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    minesCount: { type: Number },
    deck: [{ type: String }],
    revealed: [
        {
            tile: { type: Number },
            value: { type: String }
        }
    ],
    fair: {
        seed: { type: mongoose.Schema.ObjectId, ref: 'UserSeed' },
        nonce: { type: Number }
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MinesGame',  minesGameSchema);