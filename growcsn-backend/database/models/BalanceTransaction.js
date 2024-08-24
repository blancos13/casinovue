const mongoose = require('mongoose');

const balanceTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    type: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    state: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BalanceTransaction',  balanceTransactionSchema);
