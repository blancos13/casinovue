const mongoose = require('mongoose');

const tipTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    sender: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' }
    },
    receiver: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' }
    },
    state: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TipTransaction',  tipTransactionSchema);