const mongoose = require('mongoose');

const userSeedSchema = new mongoose.Schema({
    seedClient: { type: String },
    seedServer: { type: String },
    hash: { type: String },
    nonce: { type: Number },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    state: { type: String },
    updatedAt: {type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSeed',  userSeedSchema);