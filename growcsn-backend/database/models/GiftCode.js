const mongoose = require('mongoose');

const giftCodeSchema = new mongoose.Schema({
    code: { type: String },
    reward: { type: Number },
    redeemer: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GiftCode',  giftCodeSchema);
