const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const Box = require('../../database/models/Box');
const BattlesGame = require('../../database/models/BattlesGame');
const BattlesBet = require('../../database/models/BattlesBet');
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
    fairGetData
} = require('../../utils/fair');
const {
    battlesCheckGetGameDataData,
    battlesCheckGetGameDataGame,
    battlesCheckSendCreateData,
    battlesCheckSendCreateBoxes,
    battlesCheckSendCreateUser,
    battlesCheckSendBotData,
    battlesCheckSendBotGame,
    battlesCheckSendJoinData,
    battlesCheckSendJoinGame,
    battlesCheckSendJoinUser,
    battlesCheckSendCancelData,
    battlesCheckSendCancelGame,
    battlesGenerateGame,
    battlesFormatBoxes,
    battlesGetGameIndex,
    battlesGetAmountGame,
    battlesGetAmountWin,
    battlesGetRounds,
    battlesGetOutcomeItem,
    battlesGetWinnerBets,
    battlesSanitizeGames,
    battlesSanitizeGame
} = require('../../utils/battles');
const {
    generalUserGetLevel,
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');


// Battles variables
let battlesGames = [];
let battlesHistory = [];
let battlesBlockGame = [];
let battlesBlockJoin = [];

const battlesGetData = (user) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get active boxes from database
            const boxesDatabase = await Box.find({ state: 'active' }).select('name slug amount categories type state').lean();

            // Get battles games
            const games = battlesGames.filter((game) => game.options.private === false || (user !== undefined && game.bets.some((bet) => bet.bot === false && bet.user._id.toString() === user._id.toString()) === true));

            resolve({ boxes: boxesDatabase, games: battlesSanitizeGames(games), history: battlesHistory });
        } catch(err) {
            reject(err);
        }
    });
}

const battlesGetGameDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckGetGameDataData(data);

        // Get battles game from battles games array
        let battlesGame = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)];

        // If battles game was not in battles games array try to get from database
        if(battlesGame === undefined) {
            battlesGame = await BattlesGame.findById(data.gameId).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp limits stats.total affiliates anonymous createdAt' } 
            }).lean();

            // Add level and rakeback info to user objects
            for(let bet of battlesGame.bets) { 
                if(bet.bot === false) { 
                    bet.user.level = generalUserGetLevel(bet.user);
                    bet.user.rakeback = generalUserGetRakeback(bet.user); 
                } 
            }
        }

        // Validate battles game
        battlesCheckGetGameDataGame(battlesGame);

        callback({ success: true, game: battlesSanitizeGame(battlesGame, true) });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendCreateData(data);

        // Validate sent boxes
        battlesCheckSendCreateBoxes(data);

        // Get active boxes from database
        const boxesDatabase = await Box.find({ state: 'active' }).select('name amount items categories type state').populate({ path: 'items.item', select: 'name image amountFixed' }).lean();

        // Format sent boxes
        const boxes = battlesFormatBoxes(data, boxesDatabase);

        // Get battle amount
        const amount = battlesGetAmountGame(boxes);

        // Get battle user amount
        const amountUser = Math.floor(amount + (amount * Math.floor(data.playerCount) * Math.floor(data.funding) / 100));

        // Validate user
        battlesCheckSendCreateUser(user, data, amountUser);

        // Get user level
        const level = generalUserGetLevel(user);

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Create battles game in database
        let battlesGame = await battlesGenerateGame(data, amount, boxes);

        // Create database query promises array
        let promises = [];

        // Add update users data and create battles bet
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amountUser,
                    'stats.bet': amountUser
                    
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            BattlesBet.create({
                amount: amountUser,
                outcomes: [],
                slot: 0,
                game: battlesGame._id,
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
        battlesGame.bets = [dataDatabase[1]];

        // Add battles game to battles game array
        battlesGames.push(battlesGame);

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send battles game to frontend if not private game
        if(battlesGame.options.private === false) { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

        callback({ success: true, game: battlesSanitizeGame(battlesGame) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendBotSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendBotData(data);

        // Validate battles game
        battlesCheckSendBotGame(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to game block array
            battlesBlockGame.push(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString());

            // Get game bet amount
            const amountGameBet = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount - Math.floor(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount * battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.funding / 100);

            // Create database query promises array
            let promises = [];

            // Add create battles bet queries to promises array
            for(let i = 0; i < battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].playerCount; i++) {
                if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.some((element) => element.slot === i) !== true) {
                    promises.push(
                        BattlesBet.create({
                            amount: amountGameBet,
                            outcomes: [],
                            slot: i,
                            game: battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id,
                            bot: true
                        })
                    );
                }
            }

            // Execute promise queries in database
            let betsDatabase = await Promise.all(promises);

            // Convert bet objects to javascript objects
            betsDatabase = betsDatabase.map((bet) => bet.toObject());

            // Add bets to game object
            battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets = [...battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets, ...betsDatabase];

            // Send battles game to frontend
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.private === true) {
                for(const bet of battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); } }
            } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); }

            // If battles game state is created start rolling game
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].state === 'created') {
                battlesGameCountdown(io, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]);
            }

            callback({ success: true });

            // Remove game id from game block array
            battlesBlockGame.splice(battlesBlockGame.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockGame.splice(battlesBlockGame.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()) , 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendJoinSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendJoinData(data);

        // Validate battles game
        battlesCheckSendJoinGame(data, user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to game block array
            battlesBlockJoin.push(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString());

            // Validate if user has enougth balance
            battlesCheckSendJoinUser(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]);

            // Get game bet amount
            const amountGameBet = battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount - Math.floor(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].amount * battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.funding / 100);

            // Get user level
            const level = generalUserGetLevel(user);

            // Get user rakeback rank
            const rakeback = generalUserGetRakeback(user);

            // Create database query promises array
            let promises = [];

            // Add update users data and create battles bet queries
            promises = [
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amountGameBet,
                        'stats.bet': amountGameBet
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                BattlesBet.create({
                    amount: amountGameBet,
                    outcomes: [],
                    slot: Math.floor(data.slot),
                    game: battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id,
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
            battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.push(dataDatabase[1]);

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Send battles game to frontend
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].options.private === true) {
                for(const bet of battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); } }
            } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]) }); }

            // If battles game is full and the state is created start rolling game
            if(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].playerCount <= battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].bets.length && battlesGames[battlesGetGameIndex(battlesGames, data.gameId)].state === 'created') {
                battlesGameCountdown(io, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]);
            }

            callback({ success: true });

            // Remove game id from game block array
            battlesBlockJoin.splice(battlesBlockJoin.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockJoin.splice(battlesBlockJoin.indexOf(battlesGames[battlesGetGameIndex(battlesGames, data.gameId)]._id.toString()) , 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesSendCancelSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        battlesCheckSendCancelData(data);

        // Validate battles game
        battlesCheckSendCancelGame(user, battlesGames[battlesGetGameIndex(battlesGames, data.gameId)], battlesBlockJoin, battlesBlockGame);

        try {
            // Add game id to cancel block array
            battlesBlockGame.push(data.gameId.toString());

            callback({ success: true });

            // Remove game id from cancel block array
            battlesBlockGame.splice(battlesBlockGame.indexOf(data.gameId.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            battlesBlockGame.splice(battlesBlockGame.indexOf(data.gameId.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const battlesGameCountdown = (io, battlesGame) => {
    // Update battles game state to countdown and updated at
    battlesGame.state = 'countdown';
    battlesGame.updatedAt = new Date().getTime();

    // Update game object in battles games array
    battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

    // Send battles game to frontend
    if(battlesGame.options.private === true) {
        for(const bet of battlesGame.bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); } }
    } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

    setTimeout(() => { battlesGameValidate(io, battlesGame); }, 4000)
}

const battlesGameValidate = async(io, battlesGame) => {
    try {
        // Update battles game state to pending
        battlesGame.state = 'pending';

        // Update game object in battles games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

        // Send battles game to frontend
        if(battlesGame.options.private === true) {
            for(const bet of battlesGame.bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); } }
        } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

        // Get public seed data from eos provider
        const dataFair = await fairGetData();

        // Add public seed data to battles game object
        battlesGame.fair.seedPublic = dataFair.data.head_block_id;
        battlesGame.fair.blockId = dataFair.data.head_block_num;

        // Sort game bets by slot
        battlesGame.bets.sort((a, b) => a.slot - b.slot)

        // Update game object in battlesGames games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);

        setTimeout(() => { battlesGameRoll(io, battlesGame); }, 1000);
    } catch(err) {
        setTimeout(() => { battlesGameValidate(io, battlesGame); }, 1000 * 15);
    }
}

const battlesGameRoll = async(io, battlesGame) => {
    try {
        for(const [index, round] of battlesGetRounds(battlesGame.boxes).entries()) {
            setTimeout(() => {
                for(let slot = 0; slot < battlesGame.bets.length; slot++) {
                    // Combine battles game id, server seed, bet index to one string
                    const combined =`${battlesGame._id}-${battlesGame.fair.seedServer}-${battlesGame.fair.seedPublic}-${index}-${slot}`;
    
                    // Sha256 hash combined string
                    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    
                    // Get outcome for slot bet from combined hash
                    const outcome = parseInt(hash.substr(0, 8), 16) % 100000;
    
                    // Add round payout amount to bet
                    battlesGame.bets[slot].payout = battlesGame.bets[slot].payout + battlesGetOutcomeItem(round.box.items, outcome).amountFixed;
    
                    // Add roll outcome to bet
                    battlesGame.bets[slot].outcomes.push(outcome);
                }
    
                // Update battles game state and updated at
                battlesGame.state = 'rolling';
                battlesGame.updatedAt = new Date().getTime();
    
                // Update game object in battles games array
                battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1, battlesGame);
    
                // Send battles game to frontend
                if(battlesGame.options.private === true) {
                    for(const bet of battlesGame.bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); } }
                } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }
            }, 6500 * index);
        }

        setTimeout(() => { battlesGameComplete(io, battlesGame); }, 6500 * battlesGetRounds(battlesGame.boxes).length);
    } catch(err) {
        console.error(err);
    }
}

const battlesGameComplete = async(io, battlesGame) => {
    try {
        // Update battles game state
        battlesGame.state = 'completed';

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Create promises arrays
        let promisesUsers = [];
        let promisesBets = [];
        let promisesAffiliates = [];

        // Create reports stats and rain variable
        let amountBetTotal = 0;
        let amountBetRain = 0;

        // Get winner bets
        const winnerBets = battlesGetWinnerBets(battlesGame);

        // Get total win amount
        const amountWinTotal = battlesGetAmountWin(battlesGame);

        // Add update battles bet querys to promise array
        for(const bet of battlesGame.bets) {
            // Get payout amount for user bet
            bet.payout = winnerBets.some((element) => element._id.toString() === bet._id.toString()) === true ? Math.floor(amountWinTotal / winnerBets.length) : 0;

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
                            balance: bet.payout,
                            xp: bet.user.limits.blockSponsor !== true ? Math.floor(bet.amount * settings.general.reward.multiplier) : 0,
                            'stats.won': bet.payout,
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
                BattlesBet.findByIdAndUpdate(bet._id, {
                    payout: bet.payout,
                    multiplier: Math.floor((bet.payout / (bet.amount === 0 ? 10 : bet.amount)) * 100),
                    outcomes: bet.outcomes,
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier user bot updatedAt').populate({ 
                    path: 'user', 
                    select: 'roblox.id username avatar rank xp stats rakeback anonymous createdAt' 
                }).lean()
            );
        }

        // Update battles game, rain, users, bets and affiliates
        let dataDatabase = await Promise.all([
            BattlesGame.findByIdAndUpdate(battlesGame._id, {
                fair: battlesGame.fair,
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

        // Add battles game to battles history and remove last element from battles history if its longer then 8
        battlesHistory.unshift(battlesSanitizeGame(battlesGame));
        if(battlesHistory.length > 4) { battlesHistory.pop(); }

        // Remove battles game from battles games array
        battlesGames.splice(battlesGetGameIndex(battlesGames, battlesGame._id), 1);

        // Send battles game to frontend
        if(battlesGame.options.private === true) {
            for(const bet of battlesGame.bets) { if(bet.bot === false) { io.of('/battles').to(bet.user._id.toString()).emit('game', { game: battlesSanitizeGame(battlesGame) }); } }
        } else { io.of('/battles').emit('game', { game: battlesSanitizeGame(battlesGame) }); }

        // Send updated site rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[1] });

        // Send updated users to frontend
        for(const user of dataDatabase.slice(2, promisesUsers.length + 2)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Send updated bets to frontend
        for(const bet of dataDatabase.slice(promisesUsers.length + 2, promisesUsers.length + promisesBets.length + 2)) { 
            if(bet.bot !== true) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(bet.user), method: 'battles' }); } 
        }
    } catch(err) {
        console.error(err);
    }
}

const battlesInit = async() => {
    try {
        // Get all uncompleted battles games and last 8 completed battles games from database
        const dataDatabase = await Promise.all([
            BattlesGame.find({ $or: [{ state: 'created' }, { state: 'pending' }, { state: 'rolling' } ]}).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp limits stats.total affiliates anonymous createdAt' } 
            }).lean(),
            BattlesGame.find({ 'options.private': false, state: 'completed' }).sort({ createdAt: -1 }).limit(4).select('amount playerCount mode boxes options fair state updatedAt createdAt').populate({ 
                path: 'boxes.box', 
                select: 'name slug amount items',
                populate: { path: 'items.item', select: 'name image amountFixed' }
            }).populate({ 
                path: 'bets', 
                populate: { path: 'user', select: 'roblox.id username avatar rank xp stats.total anonymous createdAt' } 
            }).lean()
        ]);

        // Create promises array
        let promises = [];

        // Handle all uncompleted and last 4 completed battles games
        for(const game of [ ...dataDatabase[0], ...dataDatabase[1] ]) {
            if(game.state !== 'completed' && Math.floor(game.playerCount) === game.bets.length) {
                // Add update battles game query to promises array
                promises.push(
                    BattlesGame.findByIdAndUpdate(game._id, {
                        state: 'canceled',
                        updatedAt: new Date().getTime()
                    }, {})
                );

                // Add update user queries to promises array
                for(const bet of game.bets) {
                    promises.push(
                        User.findByIdAndUpdate(bet.user, {
                            $inc: {
                                balance: bet.amount,
                                'stats.bet': -bet.amount
                            },
                            updatedAt: new Date().getTime()
                        }, {})
                    );
                }
            } else {
                for(let bet of game.bets) {
                    if(bet.bot === false) {
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
                    } else { bet.user = {}; }
                }

                // Add game to battles games or battles history array
                if(game.state !== 'completed') { battlesGames.push(game); }
                else { battlesHistory.unshift(game); }
            }
        }

        // Execute database queries
        await Promise.all(promises);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    battlesGetData,
    battlesGetGameDataSocket,
    battlesSendCreateSocket,
    battlesSendBotSocket,
    battlesSendJoinSocket,
    battlesSendCancelSocket,
    battlesInit
}