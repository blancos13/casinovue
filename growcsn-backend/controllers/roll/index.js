const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const RollGame = require('../../database/models/RollGame');
const RollBet = require('../../database/models/RollBet');
const Rain = require('../../database/models/Rain');
const Leaderboard = require('../../database/models/Leaderboard');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../utils/socket');
const {
    settingGet
} = require('../../utils/setting');
const {
    rollCheckSendBetData,
    rollCheckSendBetUser,
    rollCheckSendBetGame,
    rollGetUserGameStats,
    rollGenerateGame,
    rollGetOutcome,
    rollSanitizeGame,
    rollSanitizeBets,
    rollSanitizeBet
} = require('../../utils/roll');
const {
    generalUserGetLevel,
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

// Roll variables
let rollGame = null;
let rollBets = [];
let rollHistory = [];
let rollBetPendingCount = [];

const rollGetData = () => {
    return { game: rollSanitizeGame(rollGame), bets: rollSanitizeBets(rollBets), history: rollHistory };
}

const rollSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        rollCheckSendBetData(data);

        // Validate if user has enougth balance, the users total bet amount and the potential win amount
        const userStats = rollGetUserGameStats(user, rollBets);
        rollCheckSendBetUser(data, user, userStats);

        // Validate if betting is allowed for current game
        rollCheckSendBetGame(rollGame);

        try {
            // Increase roll bet pending count by 1
            rollBetPendingCount = rollBetPendingCount + 1;

            // Get user bet amount and bet multiplier
            const amount = Math.floor(data.amount);
            const multiplier = Math.floor(data.multiplier);

            // Get user level
            const level = generalUserGetLevel(user);

            // Get user rakeback rank
            const rakeback = generalUserGetRakeback(user);

            // Update users data and create bet in database
            let dataDatabase = await Promise.all([
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amount,
                        'stats.bet': amount
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                RollBet.create({
                    amount: amount,
                    multiplier: multiplier,
                    game: rollGame._id,
                    user: user._id
                })
            ]);

            // Convert bet to javascript object
            dataDatabase[1] = dataDatabase[1].toObject();

            // Add user data to bet object
            dataDatabase[1].user = { 
                _id: user._id, 
                roblox: user.roblox, 
                username: user.username, 
                avatar: user.avatar, 
                rank: user.rank,
                xp: user.xp,
                level: level,
                rakeback: rakeback,
                affiliates: user.affiliates,
                stats: user.anonymous === true ? null : user.stats,
                limits: user.limits,
                createdAt: user.createdAt
            };

            // Add roll bet to roll bets array
            rollBets.push(dataDatabase[1]);

            // Send roll bet to frontend
            io.of('/roll').emit('bet', { bet: rollSanitizeBet(dataDatabase[1]) });

            callback({ success: true, user: dataDatabase[0] });

            // Decrease roll bet pending count by 1
            rollBetPendingCount = rollBetPendingCount - 1;

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            rollBetPendingCount = rollBetPendingCount - 1;
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const rollGameStart = async(io) => {
    try {
        // Clear roll bets array
        rollBets = [];

        // Generate new roll game
        rollGame = await rollGenerateGame();

        // Send sanitized roll game object to frontend
        io.of('/roll').emit('game', { game: rollSanitizeGame(rollGame) });

        setTimeout(() => { rollGameValidate(io); }, (1000 * 13) - (new Date().getTime() - new Date(rollGame.createdAt).getTime()))
    } catch(err) {
        console.error(err);
    }
}

const rollGameValidate = async(io) => {
    try {
        // Set roll game state to pending
        rollGame.state = 'pending';

        // Send sanitized roll game object to frontend
        io.of('/roll').emit('game', { game: rollSanitizeGame(rollGame) });

        if(rollBetPendingCount <= 0) {
            // Combine roll game id and server seed and sha256 hash the combined string
            const combined = crypto.createHash('sha256').update(`${rollGame._id}-${rollGame.fair.seed.seedServer}`).digest('hex');

            // Get roll outcome for this game
            rollGame.outcome = rollGetOutcome(combined);

            // Set roll game state to rolling
            rollGame.state = 'rolling';
            rollGame.updatedAt = new Date().getTime();

            io.of('/roll').emit('game', { game: rollGame });

            setTimeout(() => { rollGameComplete(io); }, 5000);
        } else { setTimeout(() => { rollGameValidate(io); }, 500); }
    } catch(err) {
        console.error(err);
    }
}

const rollGameComplete = async(io) => {
    try {
        // Set roll game state to completed
        rollGame.state = 'completed';

        // Get running leaderboard from database if available
        let dataDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get settings
        const settings = settingGet();

        // Create promises arrays
        let promisesUsers = [];
        let promisesAffiliates = [];
        let promisesBets = [];

        // Create rain amount variable
        let amountBetRain = 0;

        // Loop through the roll bets array to complete the bets
        for(let bet of rollBets) {
            // Get user rakeback amount
            const amountRakeback = bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * bet.user.rakeback.percentage * settings.general.reward.multiplier) : 0;

            // Get payout amount for user bet
            const amountPayout = rollGame.outcome >= bet.multiplier ? Math.floor(bet.amount * (bet.multiplier / 100)) : 0;

            // Get bet limits amount
            const amountLimits = bet.multiplier >= 125 || amountPayout === 0 ? bet.amount : amountPayout;

            // Get user affiliate amount
            const amountAffiliate = bet.user.affiliates.referrer !== undefined && bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * 0.005) : 0;

            // Add user bet amount to rain bet amount if user is not sponsored
            amountBetRain = amountBetRain + (bet.user.limits.blockSponsor !== true ? bet.amount : 0);

            // Add user update query to users promises array
            promisesUsers.push(
                User.findByIdAndUpdate(bet.user._id, {
                        $inc: {
                            balance: amountPayout,
                            xp: bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * settings.general.reward.multiplier) : 0,
                            'stats.won': amountPayout,
                            'leaderboard.points': dataDatabase !== null && bet.user.limits.blockSponsor !== true && bet.user.limits.blockLeaderboard !== true ? bet.amount : 0,
                            'limits.betToWithdraw': Math.floor(bet.user.limits.betToWithdraw - amountLimits) <= 0 ? -bet.user.limits.betToWithdraw : -amountLimits,
                            'limits.betToRain': Math.floor(bet.user.limits.betToRain - amountLimits) <= 0 ? -bet.user.limits.betToRain : -amountLimits,
                            'rakeback.earned': amountRakeback,
                            'rakeback.available': amountRakeback,
                            'affiliates.generated': amountAffiliate
                        },
                        updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
            );

            // Add update users referrer query to affiliates promises array
            if(bet.user.affiliates.referrer !== undefined && amountAffiliate > 0) {
                promisesAffiliates.push(
                    User.findByIdAndUpdate(bet.user.affiliates.referrer, {
                        $inc: { 
                            'affiliates.earned': amountAffiliate,
                            'affiliates.available': amountAffiliate
                        },
                        updatedAt: new Date().getTime()
                    }, {})
                );
            }

            // Add bet update query to bets promise array
            promisesBets.push(
                RollBet.findByIdAndUpdate(bet._id, {
                    payout: amountPayout,
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier user updatedAt createdAt').populate({ 
                    path: 'user', 
                    select: 'roblox.id username avatar rank xp stats rakeback anonymous createdAt' 
                }).lean()
            );
        }

        // Execute update roll game, rain, user and bet querys
        dataDatabase = await Promise.all([
            RollGame.findByIdAndUpdate(rollGame._id, {
                outcome: rollGame.outcome,
                state: 'completed',
                updatedAt: new Date().getTime()
            }, { new: true }).select('outcome fair state createdAt').populate({ path: 'fair.seed', select: 'seedServer hash' }).lean(),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: Math.floor(amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            ...promisesUsers, 
            ...promisesAffiliates,
            ...promisesBets
        ]);

        // Add updated roll game object to roll history and remove last element from roll history if its longer then 25
        rollHistory.unshift(dataDatabase[0]);
        if(rollHistory.length > 25) { rollHistory.pop(); }

        // Send full roll game object to frontend
        io.of('/roll').emit('game', { game: dataDatabase[0] });

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[1] });

        // Send updated users to frontend
        for(const user of dataDatabase.slice(2, promisesUsers.length + promisesAffiliates.length + 2)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Add updated bets to bet list
        for(const bet of dataDatabase.slice(promisesUsers.length + promisesAffiliates.length + 2)) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(bet.user), method: 'roll' }); }

        // Start roll game after 3s cooldown
        setTimeout(() => { rollGameStart(io); }, 1000 * 3);
    } catch(err) {
        console.error(err);
    }
}

const rollInit = async(io) => {
    try {
        // Get last roll game and last 25 completed roll games from database
        let dataDatabase = await Promise.all([
            RollGame.findOne({}).sort({ createdAt: -1 }).select('fair state createdAt').populate({ 
                path: 'fair.seed', 
                select: 'seedServer' 
            }).populate({ 
                path: 'bets', 
                select: 'amount payout game user' 
            }).lean(),
            RollGame.find({ state: 'completed' }).sort({ createdAt: -1 }).limit(25).select('outcome fair state createdAt').populate({ 
                path: 'fair.seed', 
                select: 'seedServer hash' 
            }).lean()
        ]);

        // Add history games to roll history variable
        rollHistory = dataDatabase[1];

        // Handle last game if uncompleted
        if(dataDatabase[0] !== null && dataDatabase[0].state !== 'completed') {
            // Create promise array
            let promises = [];

            // Add roll bet update querys and user update querys to promise array
            for(const bet of dataDatabase[0].bets) {
                if(bet.payout === undefined) {
                    promises = [
                        ...promises,
                        RollBet.findByIdAndUpdate(bet._id, {
                            payout: bet.amount,
                            updatedAt: new Date().getTime()
                        }),
                        User.findByIdAndUpdate(bet.user, {
                            $inc: {
                                balance: bet.amount,
                                'stats.bet': -bet.amount
                            },
                            updatedAt: new Date().getTime()
                        })
                    ];
                }
            }

            // Combine roll game id and server seed and sha256 hash the combined string
            const combined = crypto.createHash('sha256').update(`${dataDatabase[0]._id}-${dataDatabase[0].fair.seed.seedServer}`).digest('hex');

            // Get roll outcome for this game
            dataDatabase[0].outcome = rollGetOutcome(combined);

            // Execute update roll game query, roll bet querys and user querys in database
            dataDatabase = await Promise.all([
                RollGame.findByIdAndUpdate(dataDatabase[0]._id, {
                    outcome: dataDatabase[0].outcome,
                    state: 'completed',
                    updatedAt: new Date().getTime()
                }, { new: true }).select('outcome fair state createdAt').populate({ 
                    path: 'fair.seed', 
                    select: 'seedServer hash' 
                }).lean(),
                ...promises
            ]);

            // Add updated roll game object to roll history and remove last element from roll history if its longer then 25
            rollHistory.unshift(dataDatabase[0]);
            if(rollHistory.length > 25) { rollHistory.pop(); }
        }

        // Start roll game
        rollGameStart(io);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    rollGetData,
    rollSendBetSocket,
    rollInit
}
