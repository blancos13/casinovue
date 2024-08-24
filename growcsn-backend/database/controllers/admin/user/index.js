const validator = require('validator');

// Load database models
const User = require('../../../database/models/User');
const RobuxTransaction = require('../../../database/models/RobuxTransaction');
const LimitedTransaction = require('../../../database/models/LimitedTransaction');
const SteamTransaction = require('../../../database/models/SteamTransaction');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');
const GiftTransaction = require('../../../database/models/GiftTransaction');
const CreditTransaction = require('../../../database/models/CreditTransaction');
const TipTransaction = require('../../../database/models/TipTransaction');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');
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
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetUserListData,
    adminCheckGetUserDataData,
    adminCheckGetUserDataUser,
    adminCheckGetUserTransactionsData,
    adminCheckGetUserGamesData,
    adminCheckSendUserValueData,
    adminCheckSendUserBalanceData,
    adminCheckSendUserBalanceUser,
    adminCheckSendUserMuteData,
    adminCheckSendUserBanData,
    adminFormatUserSort
} = require('../../../utils/admin/user');

const adminGetUserListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetUserListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get database sort query
        const sort = adminFormatUserSort(data.sort);

        // Create database select object and add username/roblox id queries
        let select = { $or: [{ 'roblox.id': { $regex: data.search, $options: 'i' } }, { username: { $regex: data.search, $options: 'i' } }, { 'ips.address': { $regex: data.search, $options: 'i' } }] };

        // Add id query to database select object
        if(validator.isMongoId(data.search) === true) { select.$or = [ ...select.$or, { _id: data.search }]; }

        // Get users and users count from database
        const dataDatabase = await Promise.all([
            User.countDocuments(select),
            User.find(select).sort(sort).limit(12).skip(offset).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], users: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminGetUserDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetUserDataData(data);

        // Get user from database
        const userDatabase = await User.findById(data.userId).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean();

        // Validate user
        adminCheckGetUserDataUser(userDatabase);

        callback({ success: true, data: userDatabase });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminGetUserTransactionListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetUserTransactionsData(data);

        // Get all transactions from database
        const dataDatabase = await Promise.all([
            RobuxTransaction.countDocuments({ $or: [{ 'deposit.user': data.userId }, { 'withdraw.user': data.userId }], state: { $in: ['canceled', 'completed'] } }),
            LimitedTransaction.countDocuments({ $or: [{ 'deposit.user': data.userId }, { 'withdraw.user': data.userId }], state: { $in: ['sent', 'canceled', 'completed'] } }),
            SteamTransaction.countDocuments({ user: data.userId, state: 'completed' }),
            CryptoTransaction.countDocuments({ user: data.userId, state: 'completed' }),
            GiftTransaction.countDocuments({ user: data.userId, state: 'completed' }),
            CreditTransaction.countDocuments({ user: data.userId, state: 'completed' }),
            TipTransaction.countDocuments({ $or: [{ 'sender.user': data.userId }, { 'receiver.user': data.userId }], state: 'completed' }),
            BalanceTransaction.countDocuments({ user: data.userId, state: 'completed' }),
            RobuxTransaction.find({ $or: [{ 'deposit.user': data.userId }, { 'withdraw.user': data.userId }], state: { $in: ['canceled', 'completed'] } }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data deposit withdraw state createdAt').lean(),
            LimitedTransaction.find({ $or: [{ 'deposit.user': data.userId }, { 'withdraw.user': data.userId }], state: { $in: ['sent', 'canceled', 'completed'] } }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data deposit withdraw state createdAt').lean(),
            SteamTransaction.find({ user: data.userId, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data type user state createdAt').lean(),
            CryptoTransaction.find({ user: data.userId, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data type user state createdAt').lean(),
            GiftTransaction.find({ user: data.userId, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data type user state createdAt').lean(),
            CreditTransaction.find({ user: data.userId, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount data type user state createdAt').lean(),
            TipTransaction.find({  $or: [{ 'sender.user': data.userId }, { 'receiver.user': data.userId }], state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount sender receiver state createdAt').populate({ path: 'sender.user', select: 'username' }).populate({ path: 'receiver.user', select: 'username' }).lean(),
            BalanceTransaction.find({ user: data.userId, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount type user state createdAt').lean()
        ]);

        // Get total transaction count
        const count = dataDatabase.slice(0, 8).reduce((a, b) => a + b, 0);

        // Format transactions
        let transactions = [
            ...dataDatabase[8].map(transaction => ({ ...transaction, method: 'robux' })),
            ...dataDatabase[9].map(transaction => ({ ...transaction, method: 'limited' })),
            ...dataDatabase[10].map(transaction => ({ ...transaction, method: 'steam' })),
            ...dataDatabase[11].map(transaction => ({ ...transaction, method: 'crypto' })),
            ...dataDatabase[12].map(transaction => ({ ...transaction, method: 'gift' })),
            ...dataDatabase[13].map(transaction => ({ ...transaction, method: 'credit' })),
            ...dataDatabase[14].map(transaction => ({ ...transaction, method: 'tip' })),
            ...dataDatabase[15].map(transaction => ({ ...transaction, method: 'balance' }))
        ];

        // Sort transactions by date
        transactions.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt); });

        // Short transactions array to 14 elements
        const offset = (data.page - 1) * 14;
        const limit = data.page * 14;
        transactions = transactions.slice(offset, limit);

        callback({ success: true, count: count, transactions: transactions });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminGetUserGameListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetUserGamesData(data);

        // Get all bets from database
        const dataDatabase = await Promise.all([
            CrashBet.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            RollBet.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            BlackjackBet.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            DuelsBet.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            MinesGame.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            TowersGame.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            UnboxGame.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            BattlesBet.countDocuments({ payout: { $exists: true, $ne: null }, user: data.userId }),
            CrashBet.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            RollBet.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            BlackjackBet.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout actions user createdAt').lean(),
            DuelsBet.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            MinesGame.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            TowersGame.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            UnboxGame.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean(),
            BattlesBet.find({ payout: { $exists: true, $ne: null }, user: data.userId }).sort({ createdAt: -1 }).limit(data.page * 14).select('amount payout user createdAt').lean()
        ]);

        // Get total games count
        const count = dataDatabase.slice(0, 8).reduce((a, b) => a + b, 0);

        // Format games
        let games = [
            ...dataDatabase[8].map(game => ({ ...game, method: 'crash' })),
            ...dataDatabase[9].map(game => ({ ...game, method: 'roll' })),
            ...dataDatabase[10].map(game => ({ ...game, method: 'blackjack' })),
            ...dataDatabase[11].map(game => ({ ...game, method: 'duels' })),
            ...dataDatabase[12].map(game => ({ ...game, method: 'mines' })),
            ...dataDatabase[13].map(game => ({ ...game, method: 'towers' })),
            ...dataDatabase[14].map(game => ({ ...game, method: 'unbox' })),
            ...dataDatabase[15].map(game => ({ ...game, method: 'battles' }))
        ];

        // Sort games by date
        games.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt); });

        // Short games array to 14 elements
        const offset = (data.page - 1) * 14;
        const limit = data.page * 14;
        games = games.slice(offset, limit);

        callback({ success: true, count: count, games: games });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendUserValueSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendUserValueData(data);

        // Update user rain block in database 
        const userDatabase = await User.findByIdAndUpdate(data.userId, { 
            [data.setting]: data.value 
        }, { new: true }).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendUserBalanceSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendUserBalanceData(data);

         // Validate sent user
        const userDatabase = await User.findById(data.userId).select('balance').lean();
        adminCheckSendUserBalanceUser(userDatabase);

        // Get balance amount
        const balance = Math.floor(data.balance);

        // Update user balance and create balance transaction in database
        let dataDatabase = await Promise.all([
            User.findByIdAndUpdate(userDatabase._id, { 
                balance: balance 
            }, { new: true }).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean(),
            BalanceTransaction.create({
                amount: Math.floor(balance - userDatabase.balance),
                type: 'adminAdjust',
                user: userDatabase._id,
                state: 'completed'
            })
        ]);

        // Send updatetd user to frontend
        io.of('/general').to(userDatabase._id.toString()).emit('user', { user: dataDatabase[0] });

        callback({ success: true, user: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendUserMuteSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendUserMuteData(data);

        // Get mute expire
        const muteExpire = new Date().getTime() + Math.floor(data.time) * 1000;

        // Update user mute in database 
        const userDatabase = await User.findByIdAndUpdate(data.userId, { 
            mute: { expire: muteExpire, reason: data.reason } 
        }, { new: true }).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendUserBanSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendUserBanData(data);

        // Get ban expire
        const banExpire = new Date().getTime() + Math.floor(data.time) * 1000;

        // Update user ban in database 
        const userDatabase = await User.findByIdAndUpdate(data.userId, { 
            ban: { expire: banExpire, reason: data.reason }
        }, { new: true }).select('local.email local.emailVerified roblox.id discord.id username avatar balance xp vault rank stats leaderboard limits ips mute ban updatedAt createdAt').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetUserListSocket,
    adminGetUserDataSocket,
    adminGetUserTransactionListSocket,
    adminGetUserGameListSocket,
    adminSendUserValueSocket,
    adminSendUserBalanceSocket,
    adminSendUserMuteSocket,
    adminSendUserBanSocket
}
