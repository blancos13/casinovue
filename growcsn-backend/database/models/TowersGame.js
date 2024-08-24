const mongoose = require('mongoose');

const towersGameSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    risk: { type: String },
    deck: [[{ type: String }]],
    revealed: [
        {
            tile: { type: Number },
            row: [{ type: String }]
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

module.exports = mongoose.model('TowersGame',  towersGameSchema);