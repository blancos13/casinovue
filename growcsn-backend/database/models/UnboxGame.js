const mongoose = require('mongoose');

const unboxGameSchema = new mongoose.Schema({
    amount: { type: Number },
    payout: { type: Number },
    multiplier: { type: Number },
    outcome: { type: Number },
    box: { type: mongoose.Schema.ObjectId, ref: 'Box' },
    fair: {
        seed: { type: mongoose.Schema.ObjectId, ref: 'UserSeed' },
        nonce: { type: Number }
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UnboxGame',  unboxGameSchema);