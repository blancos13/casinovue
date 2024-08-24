const crypto = require('crypto');

// Load database models
const User = require('../../../database/models/User');
const UserSeed = require('../../../database/models/UserSeed');
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
    generalCheckGetUserInfoData,
    generalCheckGetUserInfoUser,
    generalCheckGetUserBetsData,
    generalCheckGetUserTransactionsData,
    generalCheckSendUserAnonymousData,
    generalCheckSendUserDiscordData,
    generalCheckSendUserDiscordUser,
    generalCheckSendUserSeedData,
    generalCheckSendUserSeedGames,
    generalCheckSendUserTipData,
    generalCheckSendUserTipUser,
    generalCheckSendUserTipReceiver,
    userGetDiscordUserData,
    generalUserGetFormated,
    generalSanitizeBets,
    generalSanitizeUserSeed
} = require('../../../utils/general/user');

const generalGetUserInfoSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckGetUserInfoData(data);

        // Validate user
        let userDatabase = await User.findById(data.userId).select('roblox.id username avatar rank xp stats createdAt').lean();
        generalCheckGetUserInfoUser(userDatabase);

        // Format user object
        userDatabase = generalUserGetFormated(userDatabase);

        callback({ success: true, user: userDatabase });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalGetUserBetsSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckGetUserBetsData(data);

        // Get all bets from database
        const dataDatabase = await Promise.all([
            CrashBet.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            RollBet.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            BlackjackBet.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            DuelsBet.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            MinesGame.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            TowersGame.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            UnboxGame.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            BattlesBet.countDocuments({ payout: { $exists: true, $ne: null }, user: user._id }),
            CrashBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout actions game user createdAt').populate({ path: 'game', select: 'fair state', populate: { path: 'fair.seed', select: 'seedServer hash seedPublic' } }).lean(),
            RollBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout actions game user createdAt').populate({ path: 'game', select: 'fair state', populate: { path: 'fair.seed', select: 'seedServer hash seedPublic' } }).lean(),
            BlackjackBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout actions game user createdAt').populate({ path: 'game', select: 'fair' }).lean(),
            DuelsBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout actions game user createdAt').populate({ path: 'game', select: 'fair' }).lean(),
            MinesGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout deck revealed fair user createdAt').populate({ path: 'fair.seed', select: 'seedClient seedServer hash state' }).lean(),
            TowersGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout deck revealed fair user createdAt').populate({ path: 'fair.seed', select: 'seedClient seedServer hash state' }).lean(),
            UnboxGame.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout outcome fair user createdAt').populate({ path: 'fair.seed', select: 'seedClient seedServer hash state' }).lean(),
            BattlesBet.find({ payout: { $exists: true, $ne: null }, user: user._id }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount payout outcomes fair user createdAt').populate({ path: 'game', select: 'fair' }).lean()
        ]);

        // Get total bets count
        const count = dataDatabase.slice(0, 8).reduce((a, b) => a + b, 0);

        // Format bets
        let bets = [
            ...dataDatabase[8].map(bet => ({
                ...bet,
                method: 'crash'
            })),
            ...dataDatabase[9].map(bet => ({
                ...bet,
                method: 'roll'
            })),
            ...dataDatabase[10].map(bet => ({
                ...bet,
                method: 'blackjack'
            })),
            ...dataDatabase[11].map(bet => ({
                ...bet,
                method: 'duels'
            })),
            ...dataDatabase[12].map(bet => ({
                ...bet,
                method: 'mines'
            })),
            ...dataDatabase[13].map(bet => ({
                ...bet,
                method: 'towers'
            })),
            ...dataDatabase[14].map(bet => ({
                ...bet,
                method: 'unbox'
            })),
            ...dataDatabase[15].map(bet => ({
                ...bet,
                method: 'battles'
            }))
        ];

        // Sort bets by date
        bets.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt); });

        // Short bets array to 8 elements
        const offset = (data.page - 1) * 8;
        const limit = data.page * 8;
        bets = bets.slice(offset, limit);

        // Sanitze bet objects
        bets = generalSanitizeBets(bets);

        callback({ success: true, count: count, bets: bets });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalGetUserTransactionsSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckGetUserTransactionsData(data);

        // Get all transactions from database
        const dataDatabase = await Promise.all([
            RobuxTransaction.countDocuments({ $or: [{ 'deposit.user': user._id }, { 'withdraw.user': user._id }], state: 'completed' }),
            LimitedTransaction.countDocuments({ $or: [{ 'deposit.user': user._id }, { 'withdraw.user': user._id }], state: 'completed' }),
            SteamTransaction.countDocuments({ user: user._id, state: 'completed' }),
            CryptoTransaction.countDocuments({ user: user._id, state: 'completed' }),
            GiftTransaction.countDocuments({ user: user._id, state: 'completed' }),
            CreditTransaction.countDocuments({ user: user._id, state: 'completed' }),
            TipTransaction.countDocuments({ $or: [{ 'sender.user': user._id }, { 'receiver.user': user._id }], state: 'completed' }),
            BalanceTransaction.countDocuments({ user: user._id, state: 'completed' }),
            RobuxTransaction.find({ $or: [{ 'deposit.user': user._id }, { 'withdraw.user': user._id }], state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data deposit withdraw state createdAt').lean(),
            LimitedTransaction.find({ $or: [{ 'deposit.user': user._id }, { 'withdraw.user': user._id }], state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data deposit withdraw state createdAt').lean(),
            SteamTransaction.find({ user: user._id, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data type user state createdAt').lean(),
            CryptoTransaction.find({ user: user._id, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data type user state createdAt').lean(),
            GiftTransaction.find({ user: user._id, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data type user state createdAt').lean(),
            CreditTransaction.find({ user: user._id, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount data type user state createdAt').lean(),
            TipTransaction.find({ $or: [{ 'sender.user': user._id }, { 'receiver.user': user._id }], state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount sender receiver state createdAt').lean(),
            BalanceTransaction.find({ user: user._id, state: 'completed' }).sort({ createdAt: -1 }).limit(data.page * 8).select('amount type user state createdAt').lean()
        ]);

        // Get total transaction count
        const count = dataDatabase.slice(0, 8).reduce((a, b) => a + b, 0);
        
        // Format transactions
        let transactions = [
            ...dataDatabase[8].map(transaction => ({
                ...transaction,
                method: 'robux'
            })),
            ...dataDatabase[9].map(transaction => ({
                ...transaction,
                method: 'limited'
            })),
            ...dataDatabase[10].map(transaction => ({
                ...transaction,
                method: 'steam'
            })),
            ...dataDatabase[11].map(transaction => ({
                ...transaction,
                method: 'crypto'
            })),
            ...dataDatabase[12].map(transaction => ({
                ...transaction,
                method: 'gift'
            })),
            ...dataDatabase[13].map(transaction => ({
                ...transaction,
                method: 'credit'
            })),
            ...dataDatabase[14].map(transaction => ({
                ...transaction,
                method: 'tip'
            })),
            ...dataDatabase[15].map(transaction => ({
                ...transaction,
                method: 'balance'
            }))
        ];

        // Sort transactions by date
        transactions.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt); });

        // Short transactions array to 8 elements
        const offset = (data.page - 1) * 8;
        const limit = data.page * 8;
        transactions = transactions.slice(offset, limit);

        callback({ success: true, count: count, transactions: transactions });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalGetUserSeedSocket = async(io, socket, user, data, callback) => {
    try {
        const dataDatabase = await Promise.all([
            UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient hash nonce user state').lean(),
            UserSeed.findOne({ user: user._id, state: 'created' }).select('seedClient hash nonce user state').lean()
        ]);

        callback({ success: true, seed: generalSanitizeUserSeed(dataDatabase[0]), seedNext: generalSanitizeUserSeed(dataDatabase[1]) });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendUserAnonymousSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendUserAnonymousData(data);

        // Update user in the database
        await User.findByIdAndUpdate(user._id, { anonymous: data.anonymous });

        callback({ success: true, anonymous: data.anonymous });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendUserDiscordSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendUserDiscordData(data);

        // Validate user
        generalCheckSendUserDiscordUser(data, user);

        let query = null;
        if(data.method === 'link') {
            // Get discord user from discord api
            const userDiscord = await userGetDiscordUserData(data.tokenDiscord);

            // Add discord link query
            query = { discordId: userDiscord.id, updatedAt: new Date().getTime() };
        } else {
            // Add discord unlink query
            query = { $unset: { discordId: 1 }, updatedAt: new Date().getTime() };
        }

        // Update user in database
        const userDatabase = await User.findByIdAndUpdate(user._id, query, { new: true }).select('roblox.id discordId username rank balance stats rakeback fair anonymous agreed mute ban updatedAt createdAt').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendUserSeedSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendUserSeedData(data);

        // Get user seeds and user mines/towers games from database
        let dataDatabase = await Promise.all([
            UserSeed.findOne({ user: user._id, state: 'created' }).select('user state').lean(),
            UserSeed.findOne({ user: user._id, state: 'active' }).select('user state').lean(),
            MinesGame.find({ user: user._id, state: { $ne: 'completed' } }).select('state').lean(),
            TowersGame.find({ user: user._id, state: { $ne: 'completed' } }).select('state').lean()
        ]);

        // Validate user games
        generalCheckSendUserSeedGames([...dataDatabase[2], ...dataDatabase[3]]);

        // Generate random user client seed
        const seedClient = crypto.randomBytes(8).toString('hex');

        // Generate new user server seed
        const seedServer = crypto.randomBytes(24).toString('hex');

        // Hash new generated user server seed
        const hash = crypto.createHash('sha256').update(seedServer).digest('hex');

        // Create new user seed and update old user seed in database
        dataDatabase = await Promise.all([
            UserSeed.create({
                seedClient: seedClient,
                seedServer: seedServer,
                hash: hash,
                nonce: 1,
                user: user._id,
                state: 'created'
            }),
            UserSeed.findByIdAndUpdate(dataDatabase[0]._id, {
                seedClient: data.seedClient.trim(),
                state: 'active', 
                updatedAt: new Date() 
            }, { new: true }).select('seedClient hash nonce').lean(),
            UserSeed.findByIdAndUpdate(dataDatabase[1]._id, { 
                state: 'completed', 
                updatedAt: new Date() 
            }, {}),
        ]);

        // Convert seed object to javascript object
        dataDatabase[0] = dataDatabase[0].toObject();

        callback({ success: true, seed: generalSanitizeUserSeed(dataDatabase[1]), seedNext: generalSanitizeUserSeed(dataDatabase[0]) });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendUserTipSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendUserTipData(data);

        // Validate user balance and if allowed to tip
        generalCheckSendUserTipUser(data, user);

        // Validate receiver
        const receiverDatabase = await User.findById(data.receiverId).select('balance ban');
        generalCheckSendUserTipReceiver(user, receiverDatabase);

        // Get tip amount
        const amount = Math.floor(data.amount);

        // Update sending user, receiving user and create balance transactions in database
        let dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    'limits.limitTip': user.limits.limitTip > amount ? -amount : -user.limits.limitTip
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            User.findByIdAndUpdate(receiverDatabase._id, {
                $inc: {
                    balance: amount,
                    'limits.betToWithdraw': amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            TipTransaction.create({
                amount: amount,
                sender: {
                    user: user._id
                },
                receiver: {
                    user: receiverDatabase._id
                },
                user: user._id,
                state: 'completed'
            })
        ]);

        // Convert transaction objects to js object
        dataDatabase[2] = dataDatabase[2].toObject();

        // Sent updated sending user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Sent updated received user and tip transaction to frontend
        io.of('/general').to(dataDatabase[1]._id.toString()).emit('user', { user: dataDatabase[1] });
        io.of('/general').to(dataDatabase[1]._id.toString()).emit('userTip', { transaction: dataDatabase[2] });

        callback({ success: true, transaction: dataDatabase[2] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    generalGetUserInfoSocket,
    generalGetUserBetsSocket,
    generalGetUserTransactionsSocket,
    generalGetUserSeedSocket,
    generalSendUserAnonymousSocket,
    generalSendUserDiscordSocket,
    generalSendUserSeedSocket,
    generalSendUserTipSocket
}
