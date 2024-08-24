const mongoose = require('mongoose');

// Load database models
const User = require('../../../database/models/User');
const Rain = require('../../../database/models/Rain');
const RobuxTransaction = require('../../../database/models/RobuxTransaction');
const SteamTransaction = require('../../../database/models/SteamTransaction');
const LimitedTransaction = require('../../../database/models/LimitedTransaction');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');
const GiftTransaction = require('../../../database/models/GiftTransaction');
const CreditTransaction = require('../../../database/models/CreditTransaction');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingGet
} = require('../../../utils/setting');
const {
    captchaCheckData,
    captchaGetData
} = require('../../../utils/captcha');
const {
    generalCheckSendRainCreateData,
    generalCheckSendRainCreateRain,
    generalCheckSendRainCreateUser,
    generalCheckSendRainTipData,
    generalCheckSendRainTipRain,
    generalCheckSendRainTipUser,
    generalCheckSendRainJoinData,
    generalCheckSendRainJoinRain,
    generalCheckSendRainJoinUser,
    generalCheckSendRainJoinTransactions
} = require('../../../utils/general/rain');
const {
    generalUserGetFormated
} = require('../../../utils/general/user');

// Load controllers
const {
    generalChatAddMessage
} = require('../chat');

// General rain variables
let generalRainSite = null;
let generalRainActive = null;
let generalRainCreateBlock = [];

const generalGetRains = () => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get current site rain and if available active rain from database
            let dataDatabase = await Promise.all([
                Rain.findOne({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }).select('amount participants type state updatedAt').lean(),
                Rain.findOne({ state: 'running' }).select('amount participants creator type state updatedAt').populate({ path: 'creator', select: 'username avatar rank xp stats anonymous createdAt' }).lean()
            ]);

            // If rain is a user created rain format creater user object
            if(dataDatabase[1] !== null && dataDatabase[1].type === 'user') { 
                dataDatabase[1].creator = generalUserGetFormated(dataDatabase[1].creator); 
            }

            resolve({ site: dataDatabase[0], active: dataDatabase[1] });
        } catch(err) {
            reject(err);
        }
    });
}

const generalSendRainCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendRainCreateData(data);

        // Validate if a user rain is already running
        const rainDatabase = await Rain.findOne({ type: 'user', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }).select('type state createdAt').lean();
        generalCheckSendRainCreateRain(rainDatabase, generalRainCreateBlock);

        try {
            // Add user id to create block array
            generalRainCreateBlock.push(user._id.toString());

            // Check if user has enougth balance
            generalCheckSendRainCreateUser(data, user);

            // Get user tip amount
            const amount = Math.floor(data.amount);

            // Update user, create new rain and balance transaction in the database
            let dataDatabase = await Promise.all([
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: -amount
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                Rain.create({
                    amount: amount,
                    creator: user._id,
                    type: 'user',
                    state: 'created'
                }),
                BalanceTransaction.create({
                    amount: -amount,
                    type: 'rainCreate',
                    user: user._id,
                    state: 'completed'
                })
            ]);

            // Convert rain object to json object
            dataDatabase[1] = dataDatabase[1].toObject();

            // Send updated user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            // Call rain start function
            generalRainStart(io, dataDatabase[1]);

            callback({ success: true });

            // Remove user id from create block array
            generalRainCreateBlock.splice(generalRainCreateBlock.indexOf(user._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            generalRainCreateBlock.splice(generalRainCreateBlock.indexOf(user._id.toString()), 1);
            socketRemoveAntiSpam(socket.decoded._id);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendRainTipSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendRainTipData(data);

        // Validate if rain is available
        const rainDatabase = await Rain.findOne({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }).select('type state').lean();
        generalCheckSendRainTipRain(rainDatabase);

        // Validate user
        generalCheckSendRainTipUser(data, user);

        // Get user tip amount
        const amount = Math.floor(data.amount);

        // Update user, rain and create new balance transaction in the database
        let dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            Rain.findByIdAndUpdate(rainDatabase._id, {
                $inc: {
                    amount: amount
                }
            }, { new: true }).select('amount participants type state updatedAt').lean(),
            BalanceTransaction.create({
                amount: -amount,
                type: 'rainTip',
                user: user._id,
                state: 'completed'
            })
        ]);

        // Convert transaction object to json object
        dataDatabase[2] = dataDatabase[2].toObject();

        // Add user properties to transaction object
        dataDatabase[2].user = { _id: user._id, username: user.username };

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[1] });

        // Create rain message object
        const message = {
            transaction: dataDatabase[2],
            type: 'rainTip'
        };

        // Add message to specific chat room/s and send to frontend
        generalChatAddMessage(io, message);

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendRainJoinSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendRainJoinData(data);

        // Validate captcha
        const captchaCheck = await captchaGetData(data.captcha);
        captchaCheckData(captchaCheck);

        // Execute promises arrays
        let dataDatabase = await Promise.all([
            Rain.findOne({ state: 'running' }).select('participants type state updatedAt').lean(),
            Rain.find({ 'participants.user': user._id, state: 'completed', updatedAt: { $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24) } }).select('participants type state updatedAt').lean()
        ]);

        // Get page settings
        const settings = settingGet();

        // Validate if rain is available and user not joined already
        generalCheckSendRainJoinRain(user, dataDatabase[0], settings);

        // Validate joining user
        generalCheckSendRainJoinUser(user, dataDatabase[0], dataDatabase[1]);

        // Validate user deposit amount in the two weeks if rain is site rain
        if(dataDatabase[0].type === 'site') {
            const transactionsDatabase = await Promise.all([
                RobuxTransaction.find({ 'deposit.user': user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount deposit state createdAt').lean(),
                LimitedTransaction.find({ 'deposit.user': user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount deposit state createdAt').lean(),
                SteamTransaction.find({ 'deposit.user': user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount deposit state createdAt').lean(),
                CryptoTransaction.find({ type: 'deposit', user: user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount type user state createdAt').lean(),
                GiftTransaction.find({ type: 'deposit', user: user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount type user state createdAt').lean(),
                CreditTransaction.find({ type: 'deposit', user: user._id, state: 'completed', createdAt: { $gte: (new Date().getTime() - (1000 * 60 * 60 * 24 * 14)) } }).select('amount type user state createdAt').lean()
            ]);
            generalCheckSendRainJoinTransactions([...transactionsDatabase[0], ...transactionsDatabase[1], ...transactionsDatabase[2], ...transactionsDatabase[3], ...transactionsDatabase[4], ...transactionsDatabase[5]]);
        }

        // Update rain in database
        dataDatabase[0] = await Rain.findByIdAndUpdate(dataDatabase[0]._id, {
            $push: { participants: { user: user._id } }
        }, { new: true }).select('amount participants creator type state updatedAt').populate({ path: 'creator', select: 'username' }).lean()

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: dataDatabase[0] });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalRainStart = async(io, rain) => {
    try {
        // Get running rain from database if available
        let rainDatabase = await Rain.findOne({ state: 'running' }).select('state updatedAt').lean();

        if(rainDatabase !== null) {
            // Get delay time until active rain is completed
            const delay = (new Date(rainDatabase.updatedAt).getTime() + 1000 + 1000 * 60 * 2) - new Date().getTime();

            // Update rain in database
            rainDatabase = await Rain.findByIdAndUpdate(rain._id, {
                state: 'pending',
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount participants creator type state updatedAt').lean();

            // Call rain start function after the current active rain is completed
            setTimeout(() => { generalRainStart(io, rainDatabase); }, delay);
        } else {
            // Update rain in database
            rainDatabase = await Rain.findByIdAndUpdate(rain._id, {
                state: 'running',
                updatedAt: new Date().getTime()
            }, { new: true }).select('amount participants creator type state updatedAt').populate({ 
                path: 'creator', select: 'username avatar rank stats anonymous createdAt' 
            }).lean();

            // If rain is a user created rain format creater user object
            if(rainDatabase.type === 'user') { rainDatabase.creator = generalUserGetFormated(rainDatabase.creator); }

            // Call rain complete function after a 2 minute delay
            setTimeout(() => { generalRainComplete(io, rainDatabase); }, 1000 * 60 * 2);
        }

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: rainDatabase });
    } catch(err) {
        console.error(err);
    }
}

const generalRainComplete = async(io, rain) => {
    try {
        // Get rain from database
        let rainDatabase = await Rain.findById(rain._id).select('amount participants creator type state updatedAt').populate({ 
            path: 'participants', populate: { path: 'user', select: 'balance xp stats rakeback ips mute ban' } 
        }).lean();

        // Get total combined participants xp
        const totalXp = rainDatabase.participants.reduce((a, b) => a + b.user.xp, 0);

        // Create payout addresses array
        let payoutAddresses = [];

        // Create promise arrays
        let promisesUsers = []
        let promisesTransactions = [];

        for(const participant of rainDatabase.participants) {
            // Get user payout amount
            let payout = Math.floor(Math.floor(rainDatabase.amount / 2) / rainDatabase.participants.length);
            payout = payout + Math.floor(Math.floor(rainDatabase.amount / 2) * (participant.user.xp / totalXp));

            if(payoutAddresses.includes(participant.user.ips[0].address) !== true && isNaN(payout) === false && payout >= 10) {
                // Add user ip to payout addresses array
                payoutAddresses.push(participant.user.ips[0].address);

                // Add update user query to user promises array
                promisesUsers.push(
                    User.findByIdAndUpdate(participant.user._id, {
                        $inc: {
                            balance: payout,
                            'limits.betToWithdraw': payout,
                            'limits.betToRain': payout
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
                );

                // Add create balance transaction query to transaction promises array
                promisesTransactions.push(
                    BalanceTransaction.create({
                        amount: payout,
                        type: 'rainPayout',
                        user: participant.user._id,
                        state: 'completed'
                    })
                );
            }
        }

        // Update old rain and execute querys from promise array in database
        let dataDatabase = await Promise.all([
            Rain.findByIdAndUpdate(rainDatabase._id, { state: 'completed', updatedAt: new Date().getTime() }, { new: true }).select('amount participants state updatedAt').lean(),
            ...promisesUsers,
            ...promisesTransactions
        ]);

        // Send updated users to frontend
        for(const user of dataDatabase.slice(1, promisesUsers.length + 1)) { io.of('/general').to(user._id.toString()).emit('user', { user: user }); }

        // Send balance transactions to frontend
        for(const transaction of dataDatabase.slice(promisesUsers.length + 1)) { io.of('/general').to(transaction.user._id.toString()).emit('rainPayout', { transaction: transaction }); }

        // Create rain message object
        const message = {
            rain: dataDatabase[0],
            type: 'rainCompleted'
        };

        // Add message to specific chat room/s and send to frontend
        generalChatAddMessage(io, message);

        if(rain.type === 'site') {
            // Create new site rain in database
            rainDatabase = await Rain.create({
                amount: 250000,
                type: 'site',
                state: 'created'
            });

            // Convert rain object to json object
            rainDatabase = rainDatabase.toObject();

            // Send new rain to frontend
            io.of('/general').emit('rain', { rain: rainDatabase });

            // Call rain start function after a 28 minutes delay for the new created rain
            setTimeout(() => { generalRainStart(io, rainDatabase); }, 1000 * 60 * 28);
        }
    } catch(err) {
        console.error(err);
    }
}

const generalRainInit = async(io) => {
    try {
        // Get all uncompleted rains
        const rainsDatabase = await Rain.find({ $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }).select('participants type state createdAt').populate({ path: 'participants', populate: { path: 'user', select: 'balance stats' } }).lean();

        // Cancel all extisting rains
        for(const rain of rainsDatabase) { await Rain.findByIdAndUpdate(rain._id, { state: 'canceled', updatedAt: new Date().getTime() }, {}); }

        // Create new site rain
        let rainDatabase = await Rain.create({
            amount: 250000,
            type: 'site',
            state: 'created'
        });

        // Convert rain object to js object
        rainDatabase = rainDatabase.toObject();

        // Call rain start function after a 28 minutes delay
        setTimeout(() => { generalRainStart(io, rainDatabase); }, 1000 * 60 * 28);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    generalGetRains,
    generalSendRainCreateSocket,
    generalSendRainTipSocket,
    generalSendRainJoinSocket,
    generalRainInit
}
