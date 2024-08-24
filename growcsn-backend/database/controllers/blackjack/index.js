const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const BlackjackGame = require('../../database/models/BlackjackGame');
const BlackjackBet = require('../../database/models/BlackjackBet');
const Leaderboard = require('../../database/models/Leaderboard');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../utils/socket');
const {
    settingGet
} = require('../../utils/setting');
const {
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');
const {
    fairGetData
} = require('../../utils/fair');
const {
    blackjackCheckSendJoinData,
    blackjackCheckSendJoinTable,
    blackjackCheckSendJoinUser,
    blackjackCheckSendBetData,
    blackjackCheckSendBetTable,
    blackjackCheckSendBetBets,
    blackjackCheckSendBetSeat,
    blackjackCheckSendBetUser,
    blackjackCheckSendClearData,
    blackjackCheckSendClearTable,
    blackjackCheckSendClearSeat,
    blackjackCheckSendInsuranceData,
    blackjackCheckSendInsuranceTable,
    blackjackCheckSendInsuranceSeat,
    blackjackCheckSendInsuranceUser,
    blackjackCheckSendHitData,
    blackjackCheckSendHitTable,
    blackjackCheckSendHitSeat,
    blackjackCheckSendStandData,
    blackjackCheckSendStandTable,
    blackjackCheckSendStandSeat,
    blackjackCheckSendSplitData,
    blackjackCheckSendSplitTable,
    blackjackCheckSendSplitSeat,
    blackjackCheckSendSplitUser,
    blackjackCheckSendDoubleData,
    blackjackCheckSendDoubleTable,
    blackjackCheckSendDoubleSeat,
    blackjackCheckSendDoubleUser,
    blackjackGenerateGame,
    blackjackGenerateDeck,
    blackjackShuffleDeck,
    blackjackGetCardsValue,
    blackjackGetSideBetMultiplier,
    blackjackCheckCardsSoftSeventeen,
    blackjackTableListSanitize,
    blackjackTableSanitize,
    blackjackGetBetAmount
} = require('../../utils/blackjack');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

// Blackjack variables
let blackjackTables = [];
let blackjackBetPendingCounts = {};

const blackjackGetData = () => {
    return { tables: blackjackTableListSanitize(blackjackTables) };
}

const blackjackSendJoinSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendJoinData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendJoinTable(data, user, blackjackTables[blackjackIndexTable]);

        // Validate if user has enougth balance
        blackjackCheckSendJoinUser(user, blackjackTables[blackjackIndexTable]);

        // Get user level
        const level = Math.floor(Math.pow(user.xp / 1000 / 100, 1 / 3));

        // Get user rakeback
        const rakeback = generalUserGetRakeback(user);

        // Add bet to game object
        blackjackTables[blackjackIndexTable].players.push({ 
            seat: data.seat, 
            user: { 
                _id: user._id, 
                roblox: user.roblox,  
                username: user.username, 
                avatar: user.avatar, 
                rank: user.rank,
                level: level,
                rakeback: rakeback,
                stats: user.stats,
                limits: user.limits,
                createdAt: user.createdAt
            }, 
            bet: null 
        });

        // Sort players seat position
        blackjackTables[blackjackIndexTable].players.sort((a, b) => { return a.seat - b.seat; });

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        // Start blackjack game countdown if not already started
        if(blackjackTables[blackjackIndexTable].game.state === 'created') { 
            blackjackGameCountdown(io, blackjackTables[blackjackIndexTable]); 
        }

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendBetData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendBetTable(blackjackTables[blackjackIndexTable]);

        // Validate sent bets
        blackjackCheckSendBetBets(data.bets);

        // Create database query promise array
        let promises = [];

        // Create total bet amount
        let amountTotal = 0;

        for(const bet of data.bets) {
            // Get blackjack seat index from blackjack table players array
            const blackjackSeat = blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === bet.seat)];

            // Validate blackjack seat
            blackjackCheckSendBetSeat(bet, user, blackjackTables[blackjackIndexTable], blackjackSeat);

            // Get bet amount for the placed bet
            const amountBet = blackjackGetBetAmount(bet.amount);

            // Add bet amount to total bet amount
            amountTotal = Math.floor(amountTotal + amountBet);

            // Add blackjack bet create/update query to database
            if(blackjackSeat.bet === null) {
                promises.push(
                    BlackjackBet.create({
                        amount: {
                            main: Math.floor(bet.amount.main),
                            sideLeft: Math.floor(bet.amount.sideLeft),
                            sideRight: Math.floor(bet.amount.sideRight)
                        },
                        actions: ['created'],
                        seat: blackjackSeat.seat,
                        game: blackjackTables[blackjackIndexTable].game._id,
                        user: user._id
                    })
                );
            } else {
                promises.push(
                    BlackjackBet.findByIdAndUpdate(blackjackSeat.bet._id, {
                        $inc: {
                            'amount.main': Math.floor(bet.amount.main),
                            'amount.sideLeft': Math.floor(bet.amount.sideLeft),
                            'amount.sideRight': Math.floor(bet.amount.sideRight)
                        }
                    }, { new: true, upsert: true }).lean()
                );
            }
        }

        // Validate if user has enougth balance
        blackjackCheckSendBetUser(user, amountTotal);

        try {
            // Increase blackjack table bet pending count by 1
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] + 1;

            // Update users data and create or update blackjack bet in database
            const dataDatabase = await Promise.all([
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amountTotal,
                        'stats.bet': amountTotal
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                ...promises
            ]);

            for(let bet of dataDatabase.slice(1)) {
                // Get blackjack table seat index for bet
                const blackjackIndexSeat = blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === bet.seat);

                // Convert bet object to javascript object
                if(bet instanceof BlackjackBet === true) { bet = bet.toObject(); }

                // Update blackjack table seat bet
                blackjackTables[blackjackIndexTable].players[blackjackIndexSeat].bet = bet;
            }

            // Send blackjack table to frontend
            io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

            callback({ success: true, user: dataDatabase[0] });

            // Decrease blackjack table bet pending count by 1
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] - 1;

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] - 1;
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendClearSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendClearData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendClearTable(blackjackTables[blackjackIndexTable]);

        // Get blackjack players seats with placed bets from blackjack table players array
        let blackjackSeats = blackjackTables[blackjackIndexTable].players.filter((element) => element.user._id.toString() === user._id.toString() && element.bet !== null);

        // Validate blackjack seats
        blackjackCheckSendClearSeat(blackjackTables[blackjackIndexTable], blackjackSeats);

        try {
            // Increase blackjack table bet pending count by 1
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] + 1;

            // Create amount variable and database query promise array
            let amount = 0;
            let promises = [];

            // Get total bet amount for the requested seats
            for(const seat of blackjackSeats) { 
                amount = amount + blackjackGetBetAmount(seat.bet.amount); 

                promises.push(
                    BlackjackBet.findByIdAndDelete(seat.bet._id, {})
                );
            }

            // Update users data and create or update blackjack bet in database
            const dataDatabase = await Promise.all([
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: amount,
                        'stats.bet': -amount
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                ...promises
            ]);

            // Update blackjack table seat bet to null in blackjack table players array
            for(let seat of blackjackSeats) { 
                blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === seat.seat)].bet = null;
            }

            // Send blackjack table to frontend
            io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

            callback({ success: true, user: dataDatabase[0] });

            // Decrease blackjack table bet pending count by 1
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] - 1;

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            blackjackBetPendingCounts[Math.floor(data.table).toString()] = blackjackBetPendingCounts[Math.floor(data.table).toString()] - 1;
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
} 

const blackjackSendInsuranceSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendInsuranceData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendInsuranceTable(data, user, blackjackTables[blackjackIndexTable]);

        // Get players blackjack seats from blackjack table players array
        let blackjackSeats = blackjackTables[blackjackIndexTable].players.filter((element) => element.user._id.toString() === user._id.toString());

        let amount = 0;
        for(const blackjackSeat of blackjackSeats) {
          // Validate blackjack seat
          blackjackCheckSendInsuranceSeat(blackjackTables[blackjackIndexTable], blackjackSeat);

          // Add bet insurance amount to total insurance amount
          amount = Math.floor(amount + (blackjackSeat.bet.amount.main / 2));
        }

        // Validate if user has enougth balance
        blackjackCheckSendInsuranceUser(data, user, amount);

        if(data.insurance === true) {
            // Update user in database
            const userDatabase = await User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    'stats.bet': amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean();

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: userDatabase });
        }

        for(let blackjackSeat of blackjackSeats) {
            // Update blackjack table seat bet actions
            blackjackSeat.bet.actions.push(data.insurance === true ? 'insurance' : 'noinsurance');

            // Update seat object in blackjack tablle players array
            blackjackTables[blackjackIndexTable].players.splice(blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === blackjackSeat.seat), 1, blackjackSeat);
        }

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendHitSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendHitData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendHitTable(data, user, blackjackTables[blackjackIndexTable]);

        // Get blackjack seat from blackjack table players array
        let blackjackSeat = blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === data.seat)];

        // Validate blackjack seat
        blackjackCheckSendHitSeat(user, blackjackTables[blackjackIndexTable], blackjackSeat);

        // Add new card to player card stack
        if(blackjackSeat.bet.actions.includes('split') === false) {
            blackjackSeat.bet.cards.push(blackjackTables[blackjackIndexTable].game.deck.pop());
        } else if(blackjackSeat.bet.actions.includes('stand') === true || blackjackGetCardsValue(blackjackSeat.bet.cardsRight) >= 21) {
            blackjackSeat.bet.cardsLeft.push(blackjackTables[blackjackIndexTable].game.deck.pop());
        } else {
            blackjackSeat.bet.cardsRight.push(blackjackTables[blackjackIndexTable].game.deck.pop());
        }

        // Update blackjack table seat bet actions
        blackjackSeat.bet.actions.push('hit');

        // Update seat object in blackjack tablle players array
        blackjackTables[blackjackIndexTable].players.splice(blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === blackjackSeat.seat), 1, blackjackSeat);

        // Update blackjack table game updated at
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendStandSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendStandData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendStandTable(data, user, blackjackTables[blackjackIndexTable]);

        // Get blackjack seat from blackjack table players array
        let blackjackSeat = blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === data.seat)];

        // Validate blackjack seat
        blackjackCheckSendStandSeat(user, blackjackTables[blackjackIndexTable], blackjackSeat);

        // Update blackjack table seat bet actions
        blackjackSeat.bet.actions.push('stand');

        // Update seat object in blackjack tablle players array
        blackjackTables[blackjackIndexTable].players.splice(blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === blackjackSeat.seat), 1, blackjackSeat);

        // Update blackjack table game updated at
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendSplitSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendSplitData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendSplitTable(data, user, blackjackTables[blackjackIndexTable]);

        // Get blackjack seat from blackjack table players array
        let blackjackSeat = blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === data.seat)];

        // Validate blackjack seat
        blackjackCheckSendSplitSeat(user, blackjackTables[blackjackIndexTable], blackjackSeat);

        // Validate if user has enougth balance
        blackjackCheckSendSplitUser(user, blackjackSeat);

        // Update user in database in database
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -blackjackSeat.bet.amount.main,
                    'stats.bet': blackjackSeat.bet.amount.main
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
        ]);

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Split player card stack into two seperate hands
        blackjackSeat.bet.cardsLeft = [blackjackSeat.bet.cards[0]];
        blackjackSeat.bet.cardsRight = [blackjackSeat.bet.cards[1]];
        delete blackjackSeat.bet.cards;

        // Add new card to both player card stack hands
        blackjackSeat.bet.cardsLeft.push(blackjackTables[blackjackIndexTable].game.deck.pop());
        blackjackSeat.bet.cardsRight.push(blackjackTables[blackjackIndexTable].game.deck.pop());

        // Update blackjack table seat bet actions
        blackjackSeat.bet.actions.push('split');

        // Update seat object in blackjack tablle players array
        blackjackTables[blackjackIndexTable].players.splice(blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === blackjackSeat.seat), 1, blackjackSeat);

        // Update blackjack table game updated at
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackSendDoubleSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        blackjackCheckSendDoubleData(data);

        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === Math.floor(data.table));

        // Validate blackjack table
        blackjackCheckSendDoubleTable(data, user, blackjackTables[blackjackIndexTable]);

        // Get blackjack seat from blackjack table players array
        let blackjackSeat = blackjackTables[blackjackIndexTable].players[blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === data.seat)];

        // Validate blackjack seat
        blackjackCheckSendDoubleSeat(user, blackjackTables[blackjackIndexTable], blackjackSeat);

        // Validate if user has enougth balance
        blackjackCheckSendDoubleUser(user, blackjackSeat);

        // Update user and blackjack bet in database in database
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -blackjackSeat.bet.amount.main,
                    'stats.bet': blackjackSeat.bet.amount.main
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            BlackjackBet.findByIdAndUpdate(blackjackSeat.bet._id, {
                'amount.main': Math.floor(blackjackSeat.bet.amount.main * 2)
            }, {})
        ]);

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Update black bet amount to x2
        blackjackSeat.bet.amount.main = Math.floor(blackjackSeat.bet.amount.main * 2);

        // Add new card to player card stack
        blackjackSeat.bet.cards.push(blackjackTables[blackjackIndexTable].game.deck.pop());

        // Update blackjack table seat bet actions
        blackjackSeat.bet.actions.push('double');

        // Update seat object in blackjack tablle players array
        blackjackTables[blackjackIndexTable].players.splice(blackjackTables[blackjackIndexTable].players.findIndex((element) => element.seat === blackjackSeat.seat), 1, blackjackSeat);

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const blackjackGameCountdown = (io, blackjackTable) => {
    try {
        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === blackjackTable.table);

        // Update blackjack table game state and updated at
        blackjackTables[blackjackIndexTable].game.state = 'countdown';
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        setTimeout(() => {
            // Update blackjack table game state and updated at
            blackjackTables[blackjackIndexTable].game.state = 'pending';
            blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

            // Send blackjack table to frontend
            io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

            blackjackGameValidate(io, blackjackTables[blackjackIndexTable]); 
        }, 1000 * 10);
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameValidate = (io, blackjackTable) => {
    try {
        if(blackjackBetPendingCounts[blackjackTable.table.toString()] <= 0) {
            // Get blackjack table index from blackjack tables array
            const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === blackjackTable.table);

            // Remove all players without abet from blackjack table players array
            blackjackTables[blackjackIndexTable].players = blackjackTables[blackjackIndexTable].players.filter((element) => element.bet !== null);

            // Update blackjack table game state and updated at
            blackjackTables[blackjackIndexTable].game.state = blackjackTables[blackjackIndexTable].players.length >= 1 ? 'pending' : 'created';
            blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

            // Send blackjack table to frontend
            io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

            // Check if minimum one players has made a bet and if true run game
            if(blackjackTables[blackjackIndexTable].players.length >= 1) { blackjackGameFairness(io, blackjackTables[blackjackIndexTable]); }
        } else { setTimeout(() => { blackjackGameValidate(io, blackjackTable); }, 500); }
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameFairness = async(io, blackjackTable) => {
    try {
        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === blackjackTable.table);

        // Get public seed data from eos provider
        const dataFair = await fairGetData();

        // Add public seed data to blackjack game object
        blackjackTables[blackjackIndexTable].game.fair.seedPublic = dataFair.data.head_block_id;
        blackjackTables[blackjackIndexTable].game.fair.blockId = dataFair.data.head_block_num;

        // Combine game id, server seed and public seed
        const combined = `${blackjackTables[blackjackIndexTable].game._id}-${blackjackTables[blackjackIndexTable].game.fair.seedServer}-${blackjackTables[blackjackIndexTable].game.fair.seedPublic}`;

        // SHA256 hash the combined string
        const hash = crypto.createHash('sha256').update(combined).digest('hex');

        // Generate blackjack deck and shuffle deck
        let deck = blackjackGenerateDeck();
        deck = blackjackShuffleDeck(deck, hash);

        // Update blackjack table game deck, state and updated at
        blackjackTables[blackjackIndexTable].game.deck = deck;
        blackjackTables[blackjackIndexTable].game.state = 'running';
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        blackjackGameStart(io, blackjackTables[blackjackIndexTable]);
    } catch(err) {
        console.error(err);
        setTimeout(() => { duelsGameValidate(io, duelsGame); }, 1000 * 15);
    }
}

const blackjackGameStart = async(io, blackjackTable) => {
    try {
        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === blackjackTable.table);

        // Get blackjack table player count
        const playersCount = blackjackTables[blackjackIndexTable].players.length;

        for(let r = 0; r < 2; r++) {
            for(let p = 0; p < playersCount + 1; p++) {
                setTimeout(() => {
                    // Add card from deck to players and dealers card stack and remove the card from the deck
                    if(p < playersCount) {
                        if(blackjackTables[blackjackIndexTable].players[playersCount - 1 - p].bet.cards === undefined) { blackjackTables[blackjackIndexTable].players[playersCount - 1 - p].bet.cards = []; }
                        blackjackTables[blackjackIndexTable].players[playersCount - 1 - p].bet.cards.push(blackjackTables[blackjackIndexTable].game.deck.pop());
                    } else {
                        if(blackjackTables[blackjackIndexTable].game.dealerCards === undefined) { blackjackTables[blackjackIndexTable].game.dealerCards = []; }
                        blackjackTables[blackjackIndexTable].game.dealerCards.push(blackjackTables[blackjackIndexTable].game.deck.pop());
                    }

                    // Update blackjack table game updated at
                    blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

                    // Send blackjack table to frontend
                    io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });
                }, 1000 * (r * (playersCount + 1) + p));
            }
        }

        setTimeout(() => {
            if(blackjackTables[blackjackIndexTable].game.dealerCards[0].rank !== 'A' && blackjackGetCardsValue(blackjackTables[blackjackIndexTable].game.dealerCards) === 21) {
                blackjackGameComplete(io, blackjackTables[blackjackIndexTable]);
            } else if(blackjackTables[blackjackIndexTable].game.dealerCards[0].rank === 'A') { blackjackGameInsurance(io, blackjackTables[blackjackIndexTable]); }
            else { blackjackGameRun(io, blackjackTables[blackjackIndexTable], 4); }
        }, 2 * 1000 * (playersCount + 1));
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameInsurance = (io, blackjackTable) => {
    try {
        // Update blackjack table player pos and game updated at
        blackjackTable.playersPos = 'all';
        blackjackTable.game.updatedAt = new Date().getTime();

        // Update table object in blackjack table array
        blackjackTables.splice(blackjackTables.findIndex((element) => element.table === blackjackTable.table), 1, blackjackTable);

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTable) });

        let blackjackInsuranceInterval = setInterval(() => {
            // Get updated blackjack table from blackjack tables array
            blackjackTable = blackjackTables[blackjackTables.findIndex((element) => element.table === blackjackTable.table)];

            if(
                blackjackTable.players.length === blackjackTable.players.filter((element) => element.bet.actions.length === 2).length ||
                new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + (1000 * 10) + 500
            ) {
                clearInterval(blackjackInsuranceInterval);

                for(let i = 0; i < blackjackTable.players.length; i++) {
                    if(blackjackTable.players[i].bet.actions.length < 2) { blackjackTable.players[i].bet.actions.push('noinsurance'); }
                }

                // Update blackjack game state if dealer has blackjack, game updated at and table player pos
                if(blackjackGetCardsValue(blackjackTable.game.dealerCards) === 21) { blackjackTable.game.state = 'completed'; }
                blackjackTable.game.updatedAt = new Date().getTime();
                blackjackTable.playersPos = null;

                // Update table object in blackjack table array
                blackjackTables.splice(blackjackTables.findIndex((element) => element.table === blackjackTable.table), 1, blackjackTable);

                // Send blackjack table to frontend
                io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTable) });

                if(blackjackGetCardsValue(blackjackTable.game.dealerCards) === 21) {
                    blackjackGameComplete(io, blackjackTable);
                } else { blackjackGameRun(io, blackjackTable, 4); }
            }
        }, 500);
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameRun = async(io, blackjackTable, playerIndex) => {
    try {
        // Get updated blackjack table from blackjack tables array
        blackjackTable = blackjackTables[blackjackTables.findIndex((element) => element.table === blackjackTable.table)];

        if(playerIndex === -1) {
            // Update blackjack table player
            blackjackTable.playersPos = null;

            // Get current dealer cards and add to new array
            let dealerCards = [...blackjackTable.game.dealerCards];

            // Handle dealer card draw action
            while(
                blackjackGetCardsValue(dealerCards) < 17 ||
                (blackjackGetCardsValue(dealerCards) === 17 && blackjackCheckCardsSoftSeventeen(dealerCards) === true)
            ) {
                dealerCards.push(blackjackTable.game.deck.pop());
            }

            for(let i = 1; i < dealerCards.length; i++) {
                setTimeout(() => {
                    // Add drawed card for index to blackjack table game object
                    blackjackTable.game.dealerCards[i] = dealerCards[i];

                    // Update blackjack table game updated at
                    blackjackTable.game.updatedAt = new Date().getTime();

                    // Update table object in blackjack table array
                    blackjackTables.splice(blackjackTables.findIndex((element) => element.table === blackjackTable.table), 1, blackjackTable);

                    // Send blackjack table to frontend
                    io.of('/blackjack').emit('table', { table: blackjackTable });
                }, 1000 * (i - 1));
            }

            setTimeout(() => { blackjackGameComplete(io, blackjackTable); }, 1000 * (dealerCards.length - 1));
        } else if(blackjackTable.players[playerIndex] === undefined || blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cards) >= 21) {
            blackjackGameRun(io, blackjackTable, playerIndex - 1);
        } else {
            // Update blackjack table player pos and game updated at
            blackjackTable.playersPos = blackjackTable.players[playerIndex].seat;
            blackjackTable.game.updatedAt = new Date().getTime();

            // Update table object in blackjack table array
            blackjackTables.splice(blackjackTables.findIndex((element) => element.table === blackjackTable.table), 1, blackjackTable);

            // Send blackjack table to frontend
            io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTable) });

            // Start blackjack table seat interval checker
            let blackjackRunInterval = setInterval(() => {
                // Get updated blackjack table from blackjack tables array
                blackjackTable = blackjackTables[blackjackTables.findIndex((element) => element.table === blackjackTable.table)];

                if(
                    blackjackTable.players[playerIndex].bet.actions.includes('double') === true ||
                    (
                        blackjackTable.players[playerIndex].bet.actions.includes('split') === false &&
                        (blackjackTable.players[playerIndex].bet.actions.includes('stand') === true || blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cards) >= 21)
                    ) ||
                    (
                        blackjackTable.players[playerIndex].bet.actions.includes('split') === true &&
                        (
                            blackjackTable.players[playerIndex].bet.actions.filter((element) => element === 'stand').length >= 2 ||
                            (blackjackTable.players[playerIndex].bet.actions.includes('stand') === true && (blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cardsLeft) >= 21 || blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cardsRight) >= 21)) ||
                            (blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cardsLeft) >= 21 && blackjackGetCardsValue(blackjackTable.players[playerIndex].bet.cardsRight) >= 21)
                        )
                    )
                ) {
                    // Clear blackjack table seat interval checker and move to next seat
                    clearInterval(blackjackRunInterval);
                    blackjackGameRun(io, blackjackTable, playerIndex - 1);
                } else if(new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + (1000 * 10) + 500) {
                    // Update blackjack table players bet actions and game updated at
                    blackjackTable.players[playerIndex].bet.actions.push('stand');
                    blackjackTable.game.updatedAt = new Date().getTime();

                    // Update table object in blackjack table array
                    blackjackTables.splice(blackjackTables.findIndex((element) => element.table === blackjackTable.table), 1, blackjackTable);

                    // Send blackjack table to frontend
                    io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTable) });
                }
            }, 500);
        }
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameComplete = async(io, blackjackTable) => {
    try {
        // Get blackjack table index from blackjack tables array
        const blackjackIndexTable = blackjackTables.findIndex((element) => element.table === blackjackTable.table);

        // Get total card value for dealer cards
        const dealerValue = blackjackGetCardsValue(blackjackTables[blackjackIndexTable].game.dealerCards);

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Create database queries promises array
        let promiseUsers = [];
        let promiseBets = [];

        // Create reports stats and rain variable
        let amountBetTotal = 0;

        for(const player of blackjackTables[blackjackIndexTable].players) {
            // Create payout amount variable 
            let amountPayout = 0;

            // Get payout amount for player main bet
            if(player.bet.actions.includes('split') === true) {
                // Get total card value for both player card stacks
                let playerLeftValue = blackjackGetCardsValue(player.bet.cardsLeft);
                let playerRightValue = blackjackGetCardsValue(player.bet.cardsRight);

                if(playerLeftValue <= 21 && playerLeftValue === dealerValue) { amountPayout = player.bet.amount.main; }
                else if(playerLeftValue <= 21 && (playerLeftValue > dealerValue || dealerValue > 21)) { amountPayout = Math.floor(player.bet.amount.main * 2); }

                if(playerRightValue <= 21 && playerRightValue === dealerValue) { amountPayout = Math.floor(amountPayout + player.bet.amount.main); }
                else if(playerRightValue <= 21 && (playerRightValue > dealerValue || dealerValue > 21)) { amountPayout = Math.floor(amountPayout + (player.bet.amount.main * 2)); }
            } else {
                // Get total card value for player cards
                const playerValue = blackjackGetCardsValue(player.bet.cards);

                if(blackjackTables[blackjackIndexTable].game.dealerCards.length === 2 && dealerValue === 21) {
                    if(player.bet.cards.length === 2 && playerValue === 21) { amountPayout = player.bet.amount.main; }
                    else if(player.bet.actions.includes('insurance') === true) { amountPayout = Math.floor(player.bet.amount.main * 1.5); }
                } else {
                    if(player.bet.cards.length === 2 && playerValue === 21) { amountPayout = Math.floor(player.bet.amount.main * 2.5); }
                    else if(playerValue <= 21 && playerValue === dealerValue) { amountPayout = player.bet.amount.main; }
                    else if(playerValue <= 21 && (playerValue > dealerValue || dealerValue > 21)) { amountPayout = Math.floor(player.bet.amount.main * 2); }
                }
            }

            // Get initial two cards of player
            const cardsPlayer = player.bet.actions.includes('split') ? [player.bet.cardsLeft[0], player.bet.cardsRight[0]] : player.bet.cards.slice(0, 2);

            // Get side bet multipliers for bet
            const multiplierSideBet = blackjackGetSideBetMultiplier(blackjackTables[blackjackIndexTable].game.dealerCards, cardsPlayer);

            // Get payout amount for player perfect pair side bets
            if(player.bet.amount.sideLeft > 0) { amountPayout = amountPayout + Math.floor(player.bet.amount.sideLeft * multiplierSideBet.left); }

            // Get payout amount for player 21x3 side bets
            if(player.bet.amount.sideRight > 0) { amountPayout = amountPayout + Math.floor(player.bet.amount.sideRight * multiplierSideBet.right); }

            // Get user bet amount
            let amountBet = player.bet.amount.main + player.bet.amount.sideLeft + player.bet.amount.sideRight;
            if(player.bet.actions.includes('insurance') === true) { amountBet = amountBet + Math.floor(player.bet.amount.main / 2); }
            if(player.bet.actions.includes('split') === true) { amountBet = amountBet + player.bet.amount.main; }

            // Add bet amount to total bet amount
            amountBetTotal = amountBetTotal + amountBet;

            // Get settings
            const settings = settingGet();

            // Get user rakeback amount
            const amountRakeback = player.user.limits.blockSponsor !== true ? Math.floor(amountBet * player.user.rakeback.percentage * settings.general.reward.multiplier) : 0;

            // Add user update query to users promise array
            promiseUsers.push(
                User.findByIdAndUpdate(player.user._id, {
                        $inc: {
                            balance: amountPayout,
                            xp: player.user.limits.blockSponsor !== true ? Math.floor(amountBet * settings.general.reward.multiplier) : 0,
                            'stats.won': amountPayout,
                            'limits.betToWithdraw': player.user.limits.betToWithdraw <= amountBet <= 0 ? -player.user.limits.betToWithdraw : -amountBet,
                            'limits.betToRain': player.user.limits.betToRain <= amountBet <= 0 ? -player.user.limits.betToRain : -amountBet,
                            'leaderboard.points': leaderboardDatabase !== null && player.user.limits.blockSponsor !== true && player.user.limits.blockLeaderboard !== true ? amountBet : 0,
                            'rakeback.earned': amountRakeback,
                            'rakeback.available': amountRakeback
                        },
                        updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
            );

            // Add bet update query to bets promise array
            promiseBets.push(
                BlackjackBet.findByIdAndUpdate(player.bet._id, {
                    payout: amountPayout,
                    multiplier: Math.floor((amountPayout / amountBet) * 100),
                    cards: player.bet.cards,
                    cardsLeft: player.bet.cardsLeft,
                    cardsRight: player.bet.cardsRight,
                    actions: player.bet.actions,
                    updatedAt: new Date().getTime()
                }, { new: true }).select('amount payout multiplier actions user updatedAt createdAt').populate({ 
                    path: 'user', 
                    select: 'roblox.id username avatar rank xp stats rakeback anonymous createdAt' 
                }).lean()
            );
        }

        // Update blackjack table game state and updated at
        blackjackTables[blackjackIndexTable].game.state = 'completed';
        blackjackTables[blackjackIndexTable].game.updatedAt = new Date().getTime();

        // Send blackjack table to frontend
        io.of('/blackjack').emit('table', { table: blackjackTableSanitize(blackjackTables[blackjackIndexTable]) });

        // Execute game, user and bet update querys
        let dataDatabase = await Promise.all([
            BlackjackGame.findByIdAndUpdate(blackjackTables[blackjackIndexTable].game._id, {
                deck: blackjackTables[blackjackIndexTable].game.deck,
                dealerCards: blackjackTables[blackjackIndexTable].game.dealerCards,
                fair: blackjackTables[blackjackIndexTable].game.fair, 
                state: 'completed',
                updatedAt: new Date().getTime()
            }),
            ...promiseUsers,
            ...promiseBets
        ]);

        // Send updatetd users to frontend
        for(const user of dataDatabase.slice(1, promiseUsers.length + 1)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Send updated bets to frontend
        for(const bet of dataDatabase.slice(promiseUsers.length + 1)) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(bet.user), method: 'blackjack' }); }

        setTimeout(async() => {
            // Generate new game
            blackjackTables[blackjackIndexTable].game = await blackjackGenerateGame(blackjackTables[blackjackIndexTable].table, blackjackTables[blackjackIndexTable].game.type);

            // Update blackjack table player pos
            blackjackTables[blackjackIndexTable].playersPos = null;

            // Remove bets from blackjack table players array
            blackjackTables[blackjackIndexTable].players = blackjackTables[blackjackIndexTable].players.map((player) => ({
                ...player,
                bet: null
            }));

            blackjackGameCountdown(io, blackjackTables[blackjackIndexTable]);
        }, 3000);
    } catch(err) {
        console.error(err);
    }
}

const blackjackGameUncomplete = async(io, game) => {
    try {
        // Create promise array
        let promises = [];

        // Add blackjack bet update querys and user update querys to promise array
        for(const bet of game.bets) {
            const amountTotal = Math.floor(bet.amount.main + bet.amount.sideLeft + bet.amount.sideRight);

            promises = [
                ...promises,
                BlackjackBet.findByIdAndUpdate(bet._id, {
                    payout: amountTotal,
                    multiplier: 100,
                    updatedAt: new Date().getTime()
                }),
                User.findByIdAndUpdate(bet.user, {
                    $inc: {
                        balance: amountTotal,
                        'stats.bet': -amountTotal
                    },
                    updatedAt: new Date().getTime()
                })
            ];
        }

        // Execute blackjack game query, blackjack bet querys and user querys in database
        await Promise.all([
            BlackjackGame.findByIdAndUpdate(game._id, { state: 'canceled', updatedAt: new Date().getTime() }),
            ...promises
        ]);
    } catch(err) {
        console.error(err);
    }
}

const blackjackInit = async(io) => {
    try {
        // Get all uncompleted blackjack games and last 25 completed duels games from database
        const gamesDatabase = await BlackjackGame.find({ $or: [
            { state: 'created' },
            { state: 'pending' },
            { state: 'running' }
        ]}).select('state').populate({ path: 'bets', populate: { path: 'user', select: 'roblox.id username avatar rank' } }).lean();

        // Handle all uncompleted blackjack games
        for(const game of gamesDatabase) { blackjackGameUncomplete(io, game); }

        // Create standard and whale tables
        for(let index = 0; index < (Number(process.env.BLACKJACK_TABLES_STANDARD) + Number(process.env.BLACKJACK_TABLES_WHALE)); index++) {
            // Get game type from current index
            const type = index < Number(process.env.BLACKJACK_TABLES_STANDARD) ? 'standard' : 'whale';

            // Generate new game
            const gameDatabase = await blackjackGenerateGame(index, type);

            // Add game to blackjack table array
            blackjackTables.push({ table: index, game: gameDatabase, players: [], playersPos: null });
            
            // Add table index to blackjack bet pending counts variable
            blackjackBetPendingCounts[index.toString()] = 0;
        }
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    blackjackSendJoinSocket,
    blackjackSendBetSocket,
    blackjackSendClearSocket,
    blackjackSendInsuranceSocket,
    blackjackSendHitSocket,
    blackjackSendStandSocket,
    blackjackSendSplitSocket,
    blackjackSendDoubleSocket,
    blackjackGetData,
    blackjackInit
}
