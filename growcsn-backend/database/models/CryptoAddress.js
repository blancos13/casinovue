const mongoose = require('mongoose');

const cryptoAddressSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String }, 
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoAddress',  cryptoAddressSchema);
