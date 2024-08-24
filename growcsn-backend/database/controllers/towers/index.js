const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const UserSeed = require('../../database/models/UserSeed');
const TowersGame = require('../../database/models/TowersGame');
const Leaderboard = require('../../database/models/Leaderboard');
const Rain = require('../../database/models/Rain');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../utils/socket');
const {
    settingGet
} = require('../../utils/setting');
const {
    towersCheckSendBetData,
    towersCheckSendBetUser,
    towersCheckSendBetGame,
    towersCheckSendBetSeed,
    towersCheckSendRevealData,
    towersCheckSendRevealGame,
    towersCheckSendCashoutGame,
    towersGetGamePayout,
    towersGenerateDeck,
    towersShuffleDeck,
    towersSanitizeGame
} = require('../../utils/towers');
const {
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

// Towers variables
let towersGames = [];

const towersGetGame = (user) => {
    // Get users towers game index
    const index =  towersGames.findIndex((element) => element.user.toString() === user._id.toString());

    // Get users towers game
    const towersGame = index !== -1 ? towersSanitizeGame(towersGames[index]) : null;

    // Return users mines game
    return towersGame;
}

const towersSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        towersCheckSendBetData(data);

        // Validate user
        towersCheckSendBetUser(data, user);

        // Get users towers game
        const towersGame = towersGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user towers game
        towersCheckSendBetGame(towersGame);
        
        // Get user seed from database and check if available
        const seedDatabase = await UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient seedServer nonce user state');
        towersCheckSendBetSeed(seedDatabase);

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get user bet amount
        const amount = Math.floor(data.amount);

        // Get settings
        const settings = settingGet();

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Get user rakeback amount
        const amountRakeback = user.limits.blockSponsor !== true ? Math.floor(amount * rakeback.percentage * settings.general.reward.multiplier) : 0;

        // Get user affiliate amount
        const amountAffiliate = user.affiliates.referrer !== undefined && user.limits.blockSponsor !== true ? Math.floor(amount * 0.005) : 0;

        // Combine nonce, server seed and client seed to one string
        const combined = `${seedDatabase.seedServer}-${seedDatabase.nonce}-${seedDatabase.seedClient}`;

        // Generate towers game deck
        let deck = towersGenerateDeck(data.risk);

        // Shuffle towers game deck
        deck = towersShuffleDeck(deck, combined);

        // Create database query promises array
        let promises = [];

        // Add update users data, rain, referred user and create roll bet queries to promises array
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    xp: user.limits.blockSponsor !== true ? Math.floor(amount * settings.general.reward.multiplier) : 0,
                    'stats.bet': amount,
                    'leaderboard.points': leaderboardDatabase !== null && user.limits.blockSponsor !== true && user.limits.blockLeaderboard !== true ? amount : 0,
                    'affiliates.generated': amountAffiliate,
                    'rakeback.earned': amountRakeback,
                    'rakeback.available': amountRakeback
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            UserSeed.findByIdAndUpdate(seedDatabase._id, {
                $inc: {
                    nonce: 1
                },
            }, {}),
            TowersGame.create({
                amount: amount,
                risk: data.risk,
                deck: deck,
                fair: {
                    seed: seedDatabase._id,
                    nonce: seedDatabase.nonce
                },
                user: user._id,
                state: 'created'
            })
        ];

        // Add update users referrer query to promises array if available and affiliate amount is bigger then zero
        if(user.affiliates.referrer !== undefined && amountAffiliate > 0) {
            promises.push(
                User.findByIdAndUpdate(user.affiliates.referrer, {
                    $inc: { 
                        'affiliates.earned': amountAffiliate,
                        'affiliates.available': amountAffiliate
                    },
                    updatedAt: new Date().getTime()
                }, {})
            );
        }

        // Execute promise queries in database
        let dataDatabase = await Promise.all(promises);

        // Convert game object to javascript object
        dataDatabase[2] = dataDatabase[2].toObject();

        // Add towers game to towers games array
        towersGames.push(dataDatabase[2]);

        callback({ success: true, user: dataDatabase[0], game: towersSanitizeGame(dataDatabase[2]) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const towersSendRevealSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        towersCheckSendRevealData(data);

        // Get users towers game
        let towersGame = towersGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user towers game
        towersCheckSendRevealGame(towersGame);

        // Get title
        const tile = towersGame.risk === 'medium' && Math.floor(data.tile) === 2 ? 1 : Math.floor(data.tile);

        // Add revealed tile to game object
        towersGame.revealed.push({ tile: tile, row: towersGame.deck[towersGame.revealed.length] });

        if(towersGame.revealed[towersGame.revealed.length - 1].row[tile] === 'lose' || towersGame.revealed.length >= 8) {
            // Get payout amount for towers game
            const amountPayout = towersGame.revealed[towersGame.revealed.length - 1].row[tile] !== 'lose' ? towersGetGamePayout(towersGame) : 0;

            // Get payout multiplier
            const multiplier = Math.floor((amountPayout / towersGame.amount) * 100);

            // Get limits amount
            const amountLimits = amountPayout === 0 || multiplier >= 125 ? towersGame.amount : amountPayout;

            // Get rain bet amount if user is not sponsored
            const amountBetRain = user.limits.blockSponsor !== true ? towersGame.amount : 0;

            // Create promises database query array
            let promises = [];

            // Add update users data and towers game to promises array
            promises = [
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: amountPayout,
                        'stats.won': amountPayout,
                        'limits.betToWithdraw': Math.floor(user.limits.betToWithdraw - amountLimits) <= 0 ? -user.limits.betToWithdraw : -amountLimits,
                        'limits.betToRain': Math.floor(user.limits.betToRain - amountLimits) <= 0 ? -user.limits.betToRain : -amountLimits
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                TowersGame.findByIdAndUpdate(towersGame._id, {
                    payout: amountPayout,
                    multiplier: multiplier,
                    revealed: towersGame.revealed,
                    state: 'completed',
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier risk deck revealed user state updatedAt').lean()
            ];

            // Add update rain query to promises array
            if(amountPayout > 0) {
                promises = [
                    ...promises,
                    Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                        $inc: {
                            amount: Math.floor(amountBetRain * 0.001)
                        }
                    }, { new: true }).select('amount participants type state updatedAt').lean(),
                ]
            }

            // Execute promises array querys in database
            let dataDatabase = await Promise.all(promises);

            // Remove towers game from towers games array
            towersGames.splice(towersGames.findIndex((element) => element._id.toString() === dataDatabase[1]._id.toString()), 1);

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Send updated rain to frontend
            if(amountPayout > 0) { io.of('/general').emit('rain', { rain: dataDatabase[2] }); }

            // Send updated game to frontend
            generalAddBetsList(io, { ...dataDatabase[1], user: generalUserGetFormated(user), method: 'towers' });

            // Set updated towers game to the towers game variable
            towersGame = dataDatabase[1];
        } else {
            // Update towers game in database
            towersGame = await TowersGame.findByIdAndUpdate(towersGame._id, {
                revealed: towersGame.revealed,
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount risk deck revealed user state').lean();

            // Update towers game in towers games array
            towersGames.splice(towersGames.findIndex((element) => element._id.toString() === towersGame._id.toString()), 1, towersGame);
        }

        callback({ success: true, game: towersSanitizeGame(towersGame) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const towersSendCashoutSocket = async(io, socket, user, data, callback) => {
    try {
        // Get users towers game
        let towersGame = towersGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user towers game
        towersCheckSendCashoutGame(towersGame);

        // Get payout amount
        const amountPayout = towersGetGamePayout(towersGame);

        // Get payout multiplier
        const multiplier = Math.floor((amountPayout / towersGame.amount) * 100);

        // Get limits amount
        const amountLimits = multiplier >= 125 ? towersGame.amount : amountPayout;

        // Get rain bet amount if user is not sponsored
        const amountBetRain = user.limits.blockSponsor !== true ? towersGame.amount : 0;

        // Update user, towers game and rain in database 
        let dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: amountPayout,
                    'stats.won': amountPayout,
                    'limits.betToWithdraw': Math.floor(user.limits.betToWithdraw - amountLimits) <= 0 ? -user.limits.betToWithdraw : -amountLimits,
                    'limits.betToRain': Math.floor(user.limits.betToRain - amountLimits) <= 0 ? -user.limits.betToRain : -amountLimits
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            TowersGame.findByIdAndUpdate(towersGame._id, {
                payout: amountPayout,
                multiplier: multiplier,
                state: 'completed',
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount payout multiplier risk deck revealed user state updatedAt').lean(),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: Math.floor(amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean()
        ]);

        // Remove towers game from towers games array
        towersGames.splice(towersGames.findIndex((element) => element._id.toString() === dataDatabase[1]._id.toString()), 1);

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[2] });

        // Send updated game to frontend
        generalAddBetsList(io, { ...dataDatabase[1], user: generalUserGetFormated(user), method: 'towers' });

        callback({ success: true, user: dataDatabase[0], game: towersSanitizeGame(dataDatabase[1]) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const towersInit = async(io) => {
    try {
        // Get towers games and add to towers game array
        towersGames = await TowersGame.find({ state: 'created' }).select('amount risk deck revealed user state').lean();
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    towersGetGame,
    towersSendBetSocket,
    towersSendRevealSocket,
    towersSendCashoutSocket,
    towersInit
}