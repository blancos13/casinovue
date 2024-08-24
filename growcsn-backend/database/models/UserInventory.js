const mongoose = require('mongoose');

const userInventorySchema = new mongoose.Schema({
    items: [{
        uniqueId: { type: String },
        assetId: { type: String },
        name: { type: String },
        image: { type: String },
        amount: { type: Number }
    }],
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserInventory',  userInventorySchema);