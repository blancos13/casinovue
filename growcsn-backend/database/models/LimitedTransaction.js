const mongoose = require('mongoose');

const limitedTransactionSchema = new mongoose.Schema({
    amount: { type: Number },
    data: {
        tradeId: { type: String }
    },
    deposit: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        items: [
            {
                uniqueId: { type: String },
                assetId: { type: String },
                name: { type: String },
                image: { type: String },
                amount: { type: Number }
            }
        ]
    },
    withdraw: {
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        items: [
            {
                uniqueId: { type: String },
                assetId: { type: String },
                name: { type: String },
                image: { type: String },
                amount: { type: Number }
            }
        ] 
    },
    state: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LimitedTransaction', limitedTransactionSchema);