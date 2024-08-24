const mongoose = require('mongoose');

const cryptoPriceSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    fee: { type: Number },
});

module.exports = mongoose.model('CryptoPrice',  cryptoPriceSchema);
