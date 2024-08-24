const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String },
    type: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token',  tokenSchema);