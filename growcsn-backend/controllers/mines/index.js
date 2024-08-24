const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const UserSeed = require('../../database/models/UserSeed');
const MinesGame = require('../../database/models/MinesGame');
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
    minesCheckSendBetData,
    minesCheckSendBetUser,
    minesCheckSendBetGame,
    minesCheckSendBetSeed,
    minesCheckSendRevealData,
    minesCheckSendRevealGame,
    minesCheckSendCashoutGame,
    minesGetGamePayout,
    minesGetGameDeck,
    minesSanitizeGame
} = require('../../utils/mines');
const {
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

// Mines variables
let minesGames = [];

const minesGetGame = (user) => {
    // Get users mines game index
    const index =  minesGames.findIndex((element) => element.user.toString() === user._id.toString());

    // Get users mines game
    const minesGame = index !== -1 ? minesSanitizeGame(minesGames[index]) : null;

    // Return users mines game
    return minesGame;
}

const minesSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        minesCheckSendBetData(data);

        // Validate user
        minesCheckSendBetUser(data, user);

        // Get users mines game
        const minesGame = minesGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user mines game
        minesCheckSendBetGame(minesGame);
        
        // Get user seed from database and check if available
        const seedDatabase = await UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient seedServer nonce user state');
        minesCheckSendBetSeed(seedDatabase);

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get user bet amount and game mines count
        const amount = Math.floor(data.amount);
        const minesCount = Math.floor(data.minesCount);

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

        // Sha256 hash combined string
        const hash = crypto.createHash('sha256').update(combined).digest('hex');
        
        // Generate mines game deck
        const deck = minesGetGameDeck(minesCount, hash);

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
            MinesGame.create({
                amount: amount,
                minesCount: minesCount,
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

        // Add mines game to mines games array
        minesGames.push(dataDatabase[2]);

        callback({ success: true, user: dataDatabase[0], game: minesSanitizeGame(dataDatabase[2]) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const minesSendRevealSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        minesCheckSendRevealData(data);

        // Get users mines game
        let minesGame = minesGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user mines game
        minesCheckSendRevealGame(minesGame, data);

        // Get mines tile
        const tile = Math.floor(data.tile);

        // Add revealed tile to game object
        minesGame.revealed.push({ tile: tile, value: minesGame.deck[tile] });

        if(minesGame.deck[tile] === 'mine' || (25 - minesGame.minesCount) <= minesGame.revealed.length) {
            // Get payout amount
            const amountPayout = minesGame.deck[tile] !== 'mine' ? minesGetGamePayout(minesGame) : 0;

            // Get payout multiplier
            const multiplier = Math.floor((amountPayout / minesGame.amount) * 100);

            // Get limits amount
            const amountLimits = amountPayout === 0 || multiplier >= 125 ? minesGame.amount : amountPayout;

            // Get rain bet amount if user is not sponsored
            const amountBetRain = user.limits.blockSponsor !== true ? minesGame.amount : 0;

            // Create promises database query array
            let promises = [];

            // Add update users data and mines game to promises array
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
                MinesGame.findByIdAndUpdate(minesGame._id, {
                    payout: amountPayout,
                    multiplier: multiplier,
                    revealed: minesGame.revealed,
                    state: 'completed',
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier minesCount deck revealed user state updatedAt').lean()
            ];

            // Add update rain query to promises array
            if(amountPayout > 0) {
                promises = [
                    ...promises,
                    Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                        $inc: {
                            amount: Math.floor(amountBetRain * 0.001)
                        }
                    }, { new: true }).select('amount participants type state updatedAt').lean()
                ]
            }

            // Execute promises array querys in database
            let dataDatabase = await Promise.all(promises);

            // Remove mines game from mines games array
            minesGames.splice(minesGames.findIndex((element) => element._id.toString() === dataDatabase[1]._id.toString()), 1);

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Send updated rain to frontend
            if(amountPayout > 0) { io.of('/general').emit('rain', { rain: dataDatabase[2] }); }

            // Send updated game to frontend
            generalAddBetsList(io, { ...dataDatabase[1], user: generalUserGetFormated(user), method: 'mines' });

            // Set updated mines game to the mines game variable
            minesGame = dataDatabase[1];
        } else {
            // Update mines game in database
            minesGame = await MinesGame.findByIdAndUpdate(minesGame._id, {
                revealed: minesGame.revealed,
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount minesCount deck revealed user state').lean();

            // Update mines game in mines games array
            minesGames.splice(minesGames.findIndex((element) => element._id.toString() === minesGame._id.toString()), 1, minesGame);
        }

        callback({ success: true, game: minesSanitizeGame(minesGame) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const minesSendCashoutSocket = async(io, socket, user, data, callback) => {
    try {
        // Get users mines game
        let minesGame = minesGames.find((element) => element.user._id.toString() === user._id.toString());

        // Validate user mines game
        minesCheckSendCashoutGame(minesGame);

        // Get payout amount
        const amountPayout = minesGetGamePayout(minesGame);

        // Get payout multiplier
        const multiplier = Math.floor((amountPayout / minesGame.amount) * 100);

        // Get limits amount
        const amountLimits = multiplier >= 125 ? minesGame.amount : amountPayout;

        // Get rain bet amount if user is not sponsored
        const amountBetRain = user.limits.blockSponsor !== true ? minesGame.amount : 0;

        // Update user, mines game and rain in database 
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
            MinesGame.findByIdAndUpdate(minesGame._id, {
                payout: amountPayout,
                multiplier: multiplier,
                state: 'completed',
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount payout multiplier minesCount deck revealed user state updatedAt').lean(),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: Math.floor(amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean()
        ]);

        // Remove mines game from mines games array
        minesGames.splice(minesGames.findIndex((element) => element._id.toString() === dataDatabase[1]._id.toString()), 1);

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[2] });

        // Send updated game to frontend
        generalAddBetsList(io, { ...dataDatabase[1], user: generalUserGetFormated(user), method: 'mines' });

        callback({ success: true, user: dataDatabase[0], game: minesSanitizeGame(dataDatabase[1]) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const minesInit = async(io) => {
    try {
        // Get towers games and add to towers game array
        minesGames = await MinesGame.find({ state: 'created' }).select('amount minesCount deck revealed user state').lean();
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    minesGetGame,
    minesSendBetSocket,
    minesSendRevealSocket,
    minesSendCashoutSocket,
    minesInit
}