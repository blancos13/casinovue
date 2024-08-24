const mongoose = require('mongoose');

const limitedItemSchema = new mongoose.Schema({
    assetId: { type: String },
    name: { type: String },
    image: { type: String },
    amount: { type: Number },
    amountFixed: { type: Number },
    accepted: { type: Boolean },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LimitedItem', limitedItemSchema);