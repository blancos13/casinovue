const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    local: {
        email: { type: String },
        emailVerified: { type: Boolean },
        password: { type: String }
    },
    roblox: {
        id: { type: String },
        cookie: { type: String },
        createdAt: { type: Date }
    },
    google: {
        id: { type: String },
        email: { type: String }
    },
    discord: {
        id: { type: String }
    },
    username: { type: String },
    avatar: { type: String },
    rank: { type: String, default: 'user' },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    vault: {
        amount: { type: Number, default: 0 },
        expireAt: { type: Date }
    },
    stats: {
        bet: { type: Number, default: 0 },
        won: { type: Number, default: 0 },
        deposit: { type: Number, default: 0 },
        withdraw: { type: Number, default: 0 }
    },
    leaderboard: {
        points: { type: Number, default: 0 }
    },
    limits: {
        betToWithdraw: { type: Number, default: 0 },
        betToRain: { type: Number, default: 0 },
        blockAffiliate: { type: Boolean, default: false },
        blockRain: { type: Boolean, default: false },
        blockTip: { type: Boolean, default: false },
        limitTip: { type: Number, default: 0 },
        blockSponsor: { type: Boolean, default: false },
        blockLeaderboard: { type: Boolean, default: false }
    },
    rakeback: {
        earned: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    affiliates: {
        code: { type: String },
        referred: { type: Number, default: 0 },
        bet: { type: Number, default: 0 },
        deposit: { type: Number, default: 0 },
        earned: { type: Number, default: 0 },
        available: { type: Number, default: 0 },
        generated: { type: Number, default: 0 },
        referrer: { type: mongoose.Schema.ObjectId, ref: 'User' },
        referredAddress: { type: String },
        referredAt: { type: Date },
        redeemedCode: { type: String }
    },
    fair: {
        clientSeed: { type: String }
    },
    anonymous: { type: Boolean, default: false },
    proxy: { type: String },
    ips: [{
        address: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    mute: {
        expire: { type: Date },
        reason: { type: String }
    },
    ban: {
        expire: { type: Date },
        reason: { type: String }
    },
    verifiedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
