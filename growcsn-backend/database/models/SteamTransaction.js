const mongoose = require('mongoose');

const steamTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    data: {
        providerId: { type: String },
        providerUrl: { type: String }
    },
    type: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SteamTransaction',  steamTransactionSchema);