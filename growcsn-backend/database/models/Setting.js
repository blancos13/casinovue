const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    general: {
        maintenance: { enabled: { type: Boolean } },
        rain: { enabled: { type: Boolean } },
        leaderboard: { enabled: { type: Boolean } },
        tip: { enabled: { type: Boolean } },
        affiliate: { enabled: { type: Boolean } },
        reward: { multiplier: { type: Number } }
    },
    chat: {
        mode: { type: String },
        enabled: { type: Boolean },
        rooms: {
            en: { enabled: { type: Boolean } },
            tr: { enabled: { type: Boolean } },
            de: { enabled: { type: Boolean } },
            es: { enabled: { type: Boolean } },
            beg: { enabled: { type: Boolean } },
            whale: { enabled: { type: Boolean } }
        }
    },
    games: {
        crash: { enabled: { type: Boolean } },
        roll: { enabled: { type: Boolean } },
        blackjack: { enabled: { type: Boolean } },
        duels: { enabled: { type: Boolean } },
        mines: { enabled: { type: Boolean } },
        towers: { enabled: { type: Boolean } },
        unbox: { enabled: { type: Boolean } },
        battles: { enabled: { type: Boolean } },
        upgrader: { enabled: { type: Boolean } }
    },
    robux: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    },
    limited: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    },
    steam: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    },
    crypto: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    },
    gift: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    },
    credit: {
        deposit: { enabled: { type: Boolean } },
        withdraw: { enabled: { type: Boolean } }
    }
});

module.exports = mongoose.model('Setting',  settingSchema);
