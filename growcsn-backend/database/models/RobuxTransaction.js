const mongoose = require('mongoose');

const robuxTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    data: {
        productId: { type: String },
    },
    deposit: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        offer: { type: mongoose.Schema.ObjectId, ref: 'RobuxOffer' }
    },
    withdraw: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        offer: { type: mongoose.Schema.ObjectId, ref: 'RobuxOffer' }
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RobuxTransaction',  robuxTransactionSchema);