const crypto = require('crypto');

// Load database models
const User = require('../../database/models/User');
const UserSeed = require('../../database/models/UserSeed');
const LimitedItem = require('../../database/models/LimitedItem');
const UpgraderGame = require('../../database/models/UpgraderGame');
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
    upgraderCheckGetItemListData,
    upgraderCheckSendBetData,
    upgraderCheckSendBetUser,
    upgraderCheckSendBetSeed,
    upgraderCheckSendBetMultiplier
} = require('../../utils/upgrader');
const {
    generalUserGetRakeback,
    generalUserGetFormated
} = require('../../utils/general/user');

// Load controllers
const {
    generalAddBetsList
} = require('../general/bets');

const upgraderGetItemListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        upgraderCheckGetItemListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 105;

        // Get database sort query
        const sort = data.sort === 'highest' ? { amountFixed: -1 } : { amountFixed: 1 };

        // Get items and items count from database
        const dataDatabase = await Promise.all([
            LimitedItem.countDocuments({ name: { $regex: data.search, $options: 'i' } }),
            LimitedItem.find({ name: { $regex: data.search, $options: 'i' } }).sort(sort).limit(105).skip(offset).select('name image amountFixed').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], items: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const upgraderSendBetSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        upgraderCheckSendBetData(data);

        // Validate user
        upgraderCheckSendBetUser(data, user);

        // Get user seed from database and check if available
        const seedDatabase = await UserSeed.findOne({ user: user._id, state: 'active' }).select('seedClient seedServer nonce user state');
        upgraderCheckSendBetSeed(seedDatabase);

        // Get running leaderboard from database if available
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get user bet amount
        const amount = Math.floor(data.amount);

        // Get bet multiplier
        const multiplier = Math.floor(Math.floor(data.amountPayout) / amount * 100);

        // Validate multiplier
        upgraderCheckSendBetMultiplier(multiplier);

        // Get rain bet amount if user is not sponsored
        const amountBetRain = user.limits.blockSponsor !== true ? amount : 0;

        // Get settings
        const settings = settingGet();

        // Get user rakeback rank
        const rakeback = generalUserGetRakeback(user);

        // Get user rakeback amount
        const amountRakeback = user.limits.blockSponsor !== true ? Math.floor(amount * rakeback.percentage * settings.general.reward.multiplier) : 0;

        // Get user affiliate amount
        const amountAffiliate = user.affiliates.referrer !== undefined && user.limits.blockSponsor !== true ? Math.floor(amount * 0.005) : 0;

        // Combine nonce, server seed and client seed to one string
        const combined = `${seedDatabase.seedServer}-${seedDatabase.nonce + i}-${seedDatabase.seedClient}`;

        // Sha256 hash combined string
        const hash = crypto.createHash('sha256').update(combined).digest('hex');

        // Get game outcome
        const outcome = parseInt(hash.substr(0, 8), 16) % 100000;

        // Create payout amount variable
        let amountPayout = 0;

        // Get payout amount
        if(
            (data.mode === 'under' && Math.floor(9000 / multiplier * 1000) >= outcome) ||
            (data.mode === 'over' && Math.floor(100000 - (9000 / multiplier * 1000)) <= outcome)
        ) {
            amountPayout = Math.floor(data.amountPayout);
        }

        // Create database query promises array
        let promises = [];

        // Add update users data, user seed and rain queries to promises array
        promises = [
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: Math.floor(amountPayout - amount),
                    xp: user.limits.blockSponsor !== true ? Math.floor(amount * settings.general.reward.multiplier) : 0,
                    'stats.bet': amount,
                    'stats.won': amountPayout,
                    'limits.betToWithdraw': Math.floor(user.limits.betToWithdraw - amount) <= 0 ? -user.limits.betToWithdraw : -amount,
                    'limits.betToRain': Math.floor(user.limits.betToRain - amount) <= 0 ? -user.limits.betToRain : -amount,
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
                }
            }, {}),
            Rain.findOneAndUpdate({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }, {
                $inc: {
                    amount: Math.floor(amountBetRain * 0.001)
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            UpgraderGame.create({
                amount: amount,
                payout: amountPayout,
                multiplier: multiplier,
                outcome: outcome,
                mode: data.mode,
                fair: {
                    seed: seedDatabase._id,
                    nonce: seedDatabase.nonce
                },
                user: user._id,
                state: 'completed'
            })
        ];

        // Add update users referrer query to promises array
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
        dataDatabase[3] = dataDatabase[3].toObject();

        callback({ success: true });

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[2] });

        callback({ success: true, user: { ...dataDatabase[0], balance: Math.floor(user.balance - amount) }, games: dataDatabase[3] });

        setTimeout(async() => {
            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Add updated bets to bet list
            for(const bet of gamesDatabase) { generalAddBetsList(io, { ...bet, user: generalUserGetFormated(user), method: 'upgrader' }); }
        }, 1000 * 5);

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    upgraderGetItemListSocket,
    upgraderSendBetSocket
}