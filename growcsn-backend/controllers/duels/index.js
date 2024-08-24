const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const DuelsGame = require('../../database/models/DuelsGame');
const DuelsBet = require('../../database/models/DuelsBet');
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
    fairGetData
} = require('../../utils/fair');
const {
    duelsCheckGetGameDataData,
    duelsCheckGetGameDataGame,
    duelsCheckSendCreateData,
    duelsCheckSendCreateUser,
    duelsCheckSendBotData,
    duelsCheckSendBotGame,
    duelsCheckSendJoinData,
    duelsCheckSendJoinGame,
    duelsCheckSendJoinUser,
    duelsCheckSendCancelData,
    duelsCheckSendCancelGame,
    duelsGenerateGame,
    duelsGetGameIndex,
    duelsSanitizeGames,
    duelsSanitizeGame
} = require('../../utils/duels');
const {
    generalUserGetLevel,
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

// Duels variables
let duelsGames = [];
let duelsHistory = [];
let duelsBlockGame = [];
let duelsBlockJoin = [];
let duelsBlockCancel = [];

const duelsGetData = () => {
    return { games: duelsSanitizeGames(duelsGames), history: duelsHistory };
}

const duelsGetGameDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        duelsCheckGetGameDataData(data);

        // Get duels game from duels games array
        let duelsGame = duelsGames[duelsGetGameIndex(duelsGames, data.gameId)];

        // If duels game was not in duels games array try to get from database
        if(duelsGame === undefined) {
            duelsGame = await DuelsGame.findById(data.gameId).select('amount playerCount winner fair state createdAt').populate({ 
                path: 'winner', 
                populate: { path: 'user', select: 'roblox.id username avatar rank' } 
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank' } 
            }).lean();
        }

        // Validate duels game
        duelsCheckGetGameDataGame(duelsGame);

        callback({ success: true, game: duelsSanitizeGame(duelsGame) });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const duelsSendCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        duelsCheckSendCreateData(data);

        // Get users open duels games from duels game array
        const userGames = duelsGames.filter((game) => game.bets[0] !== undefined && game.bets[0].user._id.toString() === user._id.toString());

        // Validate if user has enougth balance and not more then 5 open games
        duelsCheckSendCreateUser(data, user, userGames);

        // Get user bet amount and player count
        const amount = Math.floor(data.amount);
        const playerCount = Math.floor(data.playerCount);

        // Get user level
        const level = generalUserGetLevel(user);

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Create duels game in database
        let duelsGame = await duelsGenerateGame(amount, playerCount);

        // Create database query promises array
        let promises = [];

        // Add update users data, create duel bet and update referred user if available
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    'stats.bet': amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            DuelsBet.create({
                amount: amount,
                game: duelsGame._id,
                user: user._id,
                bot: false
            })
        ];

        // Execute promise queries in database
        let dataDatabase = await Promise.all(promises);

        // Convert bet to javascript object
        dataDatabase[1] = dataDatabase[1].toObject();

        // Add user data to bet object
        dataDatabase[1].user = { 
            _id: user._id, 
            roblox: user.roblox, 
            username: user.username, 
            avatar: user.avatar, 
            rank: user.rank,
            level: level,
            rakeback: rakeback,
            stats: user.anonymous === true ? null : user.stats,
            limits: user.limits,
            affiliates: user.affiliates,
            createdAt: user.createdAt
        };

        // Add bet to game object
        duelsGame.bets = [dataDatabase[1]];

        // Add duels game to duels game array
        duelsGames.push(duelsGame);

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send duels game to frontend
        io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGame) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const duelsSendBotSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        duelsCheckSendBotData(data);

        // Validate duels game
        duelsCheckSendBotGame(user, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)], duelsBlockGame, duelsBlockJoin);

        try {
            // Add game id to game block array
            duelsBlockGame.push(data.gameId.toString());

            // Get game bet amount
            const amountGameBet = duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].amount;

            // Create database query promises array
            let promises = [];

            // Add create duels bet queries to promises array
            for(let i = 0; i < (duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].playerCount - duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets.length); i++) {
                promises.push(
                    DuelsBet.create({
                        amount: amountGameBet,
                        game: duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]._id,
                        bot: true
                    })
                );
            }

            // Execute promise queries in database
            let betsDatabase = await Promise.all(promises);

            // Convert bet objects to javascript objects
            betsDatabase = betsDatabase.map((bet) => bet.toObject());

            // Add bets to game object
            duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets = [...duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets, ...betsDatabase];

            // Send duels game to frontend
            io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]) });

            // If duels game is full and the state is created start rolling game
            if(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].playerCount <= duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets.length && duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].state === 'created') {
                duelsGameCountdown(io, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]);
            }

            callback({ success: true });

            // Remove game id from game block array
            duelsBlockGame.splice(duelsBlockGame.indexOf(data.gameId.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            duelsBlockGame.splice(duelsBlockGame.indexOf(data.gameId.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const duelsSendJoinSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        duelsCheckSendJoinData(data);

        // Validate duels game
        duelsCheckSendJoinGame(user, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)], duelsBlockGame, duelsBlockJoin);

        try {
            // Add game id to join block array
            duelsBlockJoin.push(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]._id.toString());

            // Validate if user has enougth balance
            duelsCheckSendJoinUser(user, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]);

            // Get game bet amount
            const amountGameBet = duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].amount;

            // Get user level
            const level = generalUserGetLevel(user);

            // Get user rakeback rank
            const rakeback = generalUserGetRakeback(user);

            // Create database query promises array
            let promises = [];

            // Add update users data, rain, referred user and create duels bet queries
            promises = [
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amountGameBet,
                        'stats.bet': amountGameBet
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                DuelsBet.create({
                    amount: amountGameBet,
                    game: duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]._id,
                    user: user._id,
                    bot: false
                })
            ];

            // Execute promise queries in database
            let dataDatabase = await Promise.all(promises);

            // Convert bet to javascript object
            dataDatabase[1] = dataDatabase[1].toObject();

            // Add user data to bet object
            dataDatabase[1].user = { 
                _id: user._id, 
                roblox: user.roblox, 
                username: user.username, 
                avatar: user.avatar, 
                rank: user.rank,
                level: level,
                rakeback: rakeback,
                stats: user.anonymous === true ? null : user.stats,
                limits: user.limits,
                affiliates: user.affiliates,
                createdAt: user.createdAt
            };

            // Add bet to game object
            duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets.push(dataDatabase[1]);

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Send duels game to frontend
            io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]) });

            // If duels game is full and the state is created start rolling game
            if(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].playerCount <= duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].bets.length && duelsGames[duelsGetGameIndex(duelsGames, data.gameId)].state === 'created') {
                duelsGameCountdown(io, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]);
            }

            callback({ success: true });

            // Remove game id from join block array
            duelsBlockJoin.splice(duelsBlockJoin.indexOf(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            duelsBlockJoin.splice(duelsBlockJoin.indexOf(duelsGames[duelsGetGameIndex(duelsGames, data.gameId)]._id.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const duelsSendCancelSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        duelsCheckSendCancelData(data);

        // Validate duels game
        duelsCheckSendCancelGame(user, duelsGames[duelsGetGameIndex(duelsGames, data.gameId)], duelsBlockGame, duelsBlockJoin);

        try {
            // Add game id to game block array
            duelsBlockGame.push(data.gameId.toString());

            callback({ success: true });

            // Remove game id from join block array
            duelsBlockGame.splice(duelsBlockGame.indexOf(data.gameId.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            duelsBlockGame.splice(duelsBlockGame.indexOf(data.gameId.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const duelsGameCountdown = (io, duelsGame) => {
    // Update duels game state to countdown and updated at
    duelsGame.state = 'countdown';
    duelsGame.updatedAt = new Date().getTime();

    // Update game object in duels games array
    duelsGames.splice(duelsGetGameIndex(duelsGames, duelsGame._id), 1, duelsGame);

    // Send duels game to frontend
    io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGame) });

    setTimeout(() => { duelsGameValidate(io, duelsGame); }, 4000)
}

const duelsGameValidate = async(io, duelsGame) => {
    try {
        // Update duels game state to pending
        duelsGame.state = 'pending';

        // Update game object in duels games array
        duelsGames.splice(duelsGetGameIndex(duelsGames, duelsGame._id), 1, duelsGame);

        // Send duels game to frontend
        io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGame) });

        // Get public seed data from eos provider
        const dataFair = await fairGetData();

        // Add public seed data to duels game object
        duelsGame.fair.seedPublic = dataFair.data.head_block_id;
        duelsGame.fair.blockId = dataFair.data.head_block_num;

        // Update game object in duels games array
        duelsGames.splice(duelsGetGameIndex(duelsGames, duelsGame._id), 1, duelsGame);

        setTimeout(() => { duelsGameRoll(io, duelsGame); }, 1000);
    } catch(err) {
        console.error(err);
        setTimeout(() => { duelsGameValidate(io, duelsGame); }, 1000 * 15);
    }
}

const duelsGameRoll = async(io, duelsGame) => {
    try {
        for(const [index, bet] of duelsGame.bets.entries()) {
            // Combine duels game id, server seed, bet index and sha256 hash the combined string
            const combined = crypto.createHash('sha256').update(`${duelsGame._id}-${duelsGame.fair.seedServer}-${duelsGame.fair.seedPublic}-${index}`).digest('hex');

            // Get roll outcome for bet from combined hash
            const roll = parseInt(combined.substr(0, 8), 16) % 10000;

            // Add roll outcome to bet
            duelsGame.bets[index].roll = roll;
        }

        // Get winner bet from duels game object
        let winnerBet = duelsGame.bets.reduce((winner, bet) => winner.roll > bet.roll ? winner : bet);

        // Update winner payout amount
        winnerBet.payout = Math.floor(duelsGame.amount * duelsGame.playerCount * 0.95);

        // Update duels game winner, state, winner bet payout amount and updated at
        duelsGame.state = 'rolling';
        duelsGame.winner = winnerBet;
        duelsGame.bets[duelsGame.bets.findIndex((element) => element._id.toString() === winnerBet._id.toString())] = winnerBet;
        duelsGame.updatedAt = new Date().getTime();

        // Update game object in duels games array
        duelsGames.splice(duelsGetGameIndex(duelsGames, duelsGame._id), 1, duelsGame);

        // Send duels game to frontend
        io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGame) });

        setTimeout(() => { duelsGameComplete(io, duelsGame); }, duelsGame.bets.length * 5000);
    } catch(err) {
        console.error(err);
    }
}

const duelsGameComplete = async(io, duelsGame) => {
    try {
        // Update duels game state
        duelsGame.state = 'completed';

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Create promises arrays
        let promisesUsers = [];
        let promisesBets = [];
        let promisesAffiliates = [];

        // Create reports stats and rain variable
        let amountBetTotal = 0;
        let amountBetRain = 0;

        // Add update duels bet querys to promise array
        for(const bet of duelsGame.bets) {
            // Get payout amount for user bet
            const amountPayout = duelsGame.winner._id.toString() === bet._id.toString() ? duelsGame.winner.payout : 0;
             
            if(bet.bot !== true) {
                // Add user bet amount to total bet amount
                amountBetTotal = amountBetTotal + bet.amount;

                // Add user bet amount to rain bet amount if user is not sponsored
                amountBetRain = amountBetRain + (bet.user.limits.blockSponsor !== true ? bet.amount : 0);

                // Get settings
                const settings = settingGet();

                // Get user rakeback amount
                const amountRakeback = bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * bet.user.rakeback.percentage * settings.general.reward.multiplier) : 0;

                // Get user affiliate amount
                const amountAffiliate = bet.user.affiliates.referrer !== undefined && bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * 0.005) : 0;

                // Add user update query to users promises array
                promisesUsers.push(
                    User.findByIdAndUpdate(bet.user._id, {
                        $inc: {
                            balance: amountPayout,
                            xp: bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * settings.general.reward.multiplier) : 0,
                            'stats.won': amountPayout,
                            'limits.betToWithdraw': bet.user.limits.betToWithdraw <= bet.amount ? -bet.user.limits.betToWithdraw : -bet.amount,
                            'limits.betToRain': bet.user.limits.betToRain <= bet.amount ? -bet.user.limits.betToRain : -bet.amount,
                            'leaderboard.points': leaderboardDatabase !== null && bet.user.limits.blockSponsor !== true && bet.user.limits.blockLeaderboard !== true ? bet.amount : 0,
                            'affiliates.generated': amountAffiliate,
                            'rakeback.earned': amountRakeback,
                            'rakeback.available': amountRakeback
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
                );

                // Add update users referrer query to affiliates promises array if available and affiliate amount is bigger then zero 
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
            }
            
            // Add user update query to bets promises array
            promisesBets.push(
                DuelsBet.findByIdAndUpdate(bet._id, {
                    payout: amountPayout,
                    multiplier: Math.floor((amountPayout / duelsGame.amount) * 100),
                    roll: bet.roll,
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier user bot updatedAt').populate({ 
                    path: 'user', 
                    select: 'roblox.id username avatar rank xp stats rakeback anonymous createdAt' 
                }).lean()
            );
        }

        // Update duels game, rain, users, bets and affiliates
        let dataDatabase = await Promise.all([
            DuelsGame.findByIdAndUpdate(duelsGame._id, {
                winner: duelsGame.winner._id,
                fair: duelsGame.fair,
                state: 'completed',
                updatedAt: new Date().getTime()
            }, {}),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: Math.floor(amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            ...promisesUsers,
            ...promisesBets,
            ...promisesAffiliates
        ]);

        // Add duels game to duels history and remove last element from duels history if its longer then 25
        duelsHistory.unshift(duelsSanitizeGame(duelsGame));
        if(duelsHistory.length > 25) { duelsHistory.pop(); }

        // Remove duels game from duels games array
        duelsGames.splice(duelsGetGameIndex(duelsGames, duelsGame._id), 1);

        // Send duels game to frontend
        io.of('/duels').emit('game', { game: duelsSanitizeGame(duelsGame) });

        // Send updated site rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[1] });

        // Send updated users to frontend
        for(const user of dataDatabase.slice(2, promisesUsers.length + 2)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Send updated bets to frontend
        for(const bet of dataDatabase.slice(promisesUsers.length + 2, promisesUsers.length + promisesBets.length + 2)) { 
            if(bet.bot !== true) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(bet.user), method: 'duels' }); } 
        }
    } catch(err) {
        console.error(err);
    }
}

const duelsInit = async(io) => {
    try {
        // Get all uncompleted duels games and last 25 completed duels games from database
        const dataDatabase = await Promise.all([
            DuelsGame.find({ $or: [{ state: 'created' }, { state: 'pending' }, { state: 'rolling' } ]}).select('amount playerCount fair state updatedAt createdAt').populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp limits stats.total affiliates anonymous createdAt' } 
            }).lean(),
            DuelsGame.find({ state: 'completed' }).sort({ createdAt: -1 }).limit(25).select('amount playerCount winner fair state createdAt').populate({ 
                path: 'winner', 
                populate: { path: 'user', select: 'roblox.id username avatar rank createdAt' } 
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank createdAt' } 
            }).lean()
        ]);

        // Add history games to duels history variable
        duelsHistory = dataDatabase[1];

        // Create promises array
        let promises = [];

        // Handle all uncompleted crash games
        for(const game of dataDatabase[0]) {
            if(game.playerCount === game.bets.length) {
                // Add update duels game query to promises array
                promises.push(
                    DuelsGame.findByIdAndUpdate(game._id, {
                        state: 'canceled',
                        updatedAt: new Date().getTime()
                    }, {})
                );

                // Add update user queries to promises array
                for(const bet of game.bets) {
                    promises.push(
                        User.findByIdAndUpdate(bet.user, {
                            $inc: {
                                balance: game.amount,
                                'stats.total.bet': -game.amount,
                                'stats.duels.bet': -game.amount
                            },
                            updatedAt: new Date().getTime()
                        }, {})
                    );
                }
            } else {
                for(let bet of game.bets) {
                    // Get user level
                    const level = generalUserGetLevel(bet.user);

                    // Get user rakeback rank
                    const rakeback = generalUserGetRakeback(bet.user);

                    // Update bet user
                    bet.user = { 
                        _id: bet.user._id, 
                        roblox: bet.user.roblox, 
                        username: bet.user.username, 
                        avatar: bet.user.avatar, 
                        rank: bet.user.rank,
                        level: level,
                        rakeback: rakeback,
                        stats: bet.user.anonymous === true ? null : bet.user.stats,
                        limits: bet.user.limits,
                        affiliates: bet.user.affiliates,
                        createdAt: bet.user.createdAt
                    };
                }

                // Add uncompleted game to duels games array
                duelsGames.push(game); 
            }
        }

        // Execute database queries
        await Promise.all(promises);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    duelsGetData,
    duelsGetGameDataSocket,
    duelsSendCreateSocket,
    duelsSendBotSocket,
    duelsSendJoinSocket,
    duelsSendCancelSocket,
    duelsInit
}
