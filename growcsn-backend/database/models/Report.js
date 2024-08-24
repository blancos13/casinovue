const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    stats: {
        total: {
            user: { type: Number, default: 0 },
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        limited: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        robux: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        steam: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        crypto: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        gift: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        },
        credit: {
            deposit: { type: Number, default: 0 },
            withdraw: { type: Number, default: 0 }
        }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report',  reportSchema);
