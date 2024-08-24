const mongoose = require('mongoose');

// Load database models
const CrashBet = require('../../../database/models/CrashBet');
const RollBet = require('../../../database/models/RollBet');
const BlackjackBet = require('../../../database/models/BlackjackBet');
const DuelsBet = require('../../../database/models/DuelsBet');
const MinesGame = require('../../../database/models/MinesGame');
const TowersGame = require('../../../database/models/TowersGame');
const UnboxGame = require('../../../database/models/UnboxGame');
const BattlesBet = require('../../../database/models/BattlesBet');

// Load utils
const {
    generalUserGetFormated
} = require('../../../utils/general/user');

// Crash variables
let generalBets = { all: [], whale: [], lucky: [], my: [] };

const generalGetBetsDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Create bets variable
        let bets = generalBets;

        // If the user is logged in add users bets to bets variable
        if(user !== undefined && user !== null) {
            // Create promises array and add user bet querys to the promise array
            let promises = [
                CrashBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                RollBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                BlackjackBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier actions user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                DuelsBet.find({ payout: { $exists: true, $ne: null }, user: user._id, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                MinesGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                TowersGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                UnboxGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
                BattlesBet.find({ payout: { $exists: true, $ne: null }, user: user._id, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean()
            ];

            // Execute the user get querys
            const dataDatabase = await Promise.all(promises);

            // Add game mode to bet object
            bets.my = [ 
                ...dataDatabase[0].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'crash'})), 
                ...dataDatabase[1].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'roll'})), 
                ...dataDatabase[2].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'blackjack'})), 
                ...dataDatabase[3].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'duels'})),
                ...dataDatabase[4].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'mines'})),
                ...dataDatabase[5].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'towers'})),
                ...dataDatabase[6].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'unbox'})) ,
                ...dataDatabase[7].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'battles'})) 
            ];

            // Sort bets by date
            bets.my.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });

            // Short bets arrays to 15 bets
            bets.my = bets.my.slice(0, 15);
        }

        callback({ success: true, bets: bets });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}


const generalAddBetsList = (io, bet) => {
    try {
        // Add bet to all bets, sort all bets and limit to a count of 15 bets
        generalBets.all.unshift(bet);
        generalBets.all.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
        if(generalBets.all.length > 15) { generalBets.all.pop(); }

        // Add bet to whale bets, sort whale bets and limit to a count of 15 bets if payout is >= DL10,000
        if(bet.payout >= 10000000) {
            generalBets.whale.unshift(bet);
            generalBets.whale.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
            if(generalBets.whale.length > 15) { generalBets.whale.pop(); }
        }

        // Add bet to whale bets, sort whale bets and limit to a count of 15 bets if multiplier is >= 5x
        if(bet.payout >= 10 && bet.multiplier >= 500) {
            generalBets.lucky.unshift(bet);
            generalBets.lucky.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
            if(generalBets.lucky.length > 15) { generalBets.lucky.pop(); }
        }

        // Send bet to frontend
        io.of('/general').emit('bet', { bet: bet });
    } catch(err) {
        console.error(err);
    }
}

const generalBetsInit = async() => {
    try {
        // Create promises array with get all and high bet querys
        let promises = [
            CrashBet.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            RollBet.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BlackjackBet.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier actions user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            DuelsBet.find({ payout: { $exists: true, $ne: null }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            MinesGame.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            TowersGame.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            UnboxGame.find({ payout: { $exists: true, $ne: null } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BattlesBet.find({ payout: { $exists: true, $ne: null }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            CrashBet.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            RollBet.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BlackjackBet.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier actions user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            DuelsBet.find({ payout: { $exists: true, $ne: null, $gte: 10000000 }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            MinesGame.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            TowersGame.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            UnboxGame.find({ payout: { $exists: true, $ne: null, $gte: 10000000 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BattlesBet.find({ payout: { $exists: true, $ne: null, $gte: 10000000 }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            CrashBet.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            RollBet.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BlackjackBet.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier actions user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            DuelsBet.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            MinesGame.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            TowersGame.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            UnboxGame.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 } }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean(),
            BattlesBet.find({ payout: { $exists: true, $ne: null, $gte: 10 }, multiplier: { $gte: 500 }, bot: false }).sort({ updatedAt: -1 }).limit(15).select('amount payout multiplier user bot updatedAt createdAt').populate({ path: 'user', select: 'roblox.id username avatar rank xp stats rakeback anonymous' }).lean()
        ];

        // Execute the user get querys
        const dataDatabase = await Promise.all(promises);

        // Add game mode to bet object
        generalBets.all = [ 
            ...dataDatabase[0].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'crash'})), 
            ...dataDatabase[1].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'roll'})), 
            ...dataDatabase[2].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'blackjack'})), 
            ...dataDatabase[3].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'duels'})), 
            ...dataDatabase[4].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'mines'})), 
            ...dataDatabase[5].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'towers'})), 
            ...dataDatabase[6].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'unbox'})), 
            ...dataDatabase[7].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'battles'})) 
        ];
        generalBets.whale = [ 
            ...dataDatabase[8].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'crash'})), 
            ...dataDatabase[9].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'roll'})), 
            ...dataDatabase[10].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'blackjack'})), 
            ...dataDatabase[11].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'duels'})), 
            ...dataDatabase[12].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'mines'})), 
            ...dataDatabase[13].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'towers'})), 
            ...dataDatabase[14].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'unbox'})), 
            ...dataDatabase[15].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'battles'})) 
        ];
        generalBets.lucky = [ 
            ...dataDatabase[16].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'crash'})), 
            ...dataDatabase[17].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'roll'})), 
            ...dataDatabase[18].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'blackjack'})), 
            ...dataDatabase[19].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'duels'})), 
            ...dataDatabase[20].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'mines'})), 
            ...dataDatabase[21].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'towers'})), 
            ...dataDatabase[22].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'unbox'})), 
            ...dataDatabase[23].map((bet) => ({...bet, user: generalUserGetFormated(bet.user), method: 'battles'})) 
        ];

        // Sort bets by date
        generalBets.all.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
        generalBets.whale.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });
        generalBets.lucky.sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt); });

        // Short bets arrays to 15 bets
        generalBets.all = generalBets.all.slice(0, 15);
        generalBets.whale = generalBets.whale.slice(0, 15);
        generalBets.lucky = generalBets.lucky.slice(0, 15);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    generalGetBetsDataSocket,
    generalAddBetsList,
    generalBetsInit
}
