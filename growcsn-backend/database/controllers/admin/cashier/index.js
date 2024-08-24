const crypto = require('crypto');

// Load database models
const User = require('../../../database/models/User');
const RobuxOffer = require('../../../database/models/RobuxOffer');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');
const GiftCode = require('../../../database/models/GiftCode');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    cashierRobuxGetBlockOffer,
    cashierRobuxAddBlockOffer,
    cashierRobuxRemoveBlockOffer
} = require('../../../utils/cashier/robux');
const {
    adminCheckGetCashierListData,
    adminCheckSendCashierCryptoActionData,
    adminCheckSendCashierCryptoActionTransaction,
    adminCheckSendCashierRobuxCancelData,
    adminCheckSendCashierRobuxCancelOffer,
    adminCheckSendCashierCreateData
} = require('../../../utils/admin/cashier');

// Admin cashier variables
let adminCashierBlockCrypto = [];

const adminGetCashierListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetCashierListData(data);

        // Get robux offers count, crypto transaction count, robux offers and crypto transactions from database
        const dataDatabase = await Promise.all([
            RobuxOffer.countDocuments({ $or: [{ state: 'created' }, { state: 'pending' }] }),
            CryptoTransaction.countDocuments({ type: 'withdraw', state: 'pending' }),
            RobuxOffer.find({ $or: [{ state: 'created' }, { state: 'pending' }] }).sort({ createdAt: 1 }).limit(data.page * 12).select('amount amountProcessed type user state').populate({ 
                path: 'user', 
                select: 'username avatar rank' 
            }).lean(),
            CryptoTransaction.find({ type: 'withdraw', state: 'pending' }).sort({ createdAt: 1 }).limit(data.page * 12).select('amount data type user state').populate({ 
                path: 'user', 
                select: 'username avatar rank' 
            }).lean()
        ]);

        // Get total transaction count
        const count = dataDatabase.slice(0, 2).reduce((a, b) => a + b, 0);

        // Format transactions
        let transactions = [
            ...dataDatabase[2].map(transaction => ({ ...transaction, method: 'robux' })),
            ...dataDatabase[3].map(transaction => ({ ...transaction, method: 'crypto' }))
        ];

        // Sort transactions by date
        transactions.sort((a, b) => { return b.amount - a.amount; });

        // Short transactions array to 12 elements
        const offset = (data.page - 1) * 12;
        const limit = data.page * 12;
        transactions = transactions.slice(offset, limit);

        callback({ success: true, count: count, transactions: transactions });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendCashierCryptoActionSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendCashierCryptoActionData(data);

        // Get user crypto transaction from the database
        const transactionDatabase = await CryptoTransaction.findById(data.transactionId).select('amount data type user state').lean();

        // Validate offer
        adminCheckSendCashierCryptoActionTransaction(transactionDatabase, adminCashierBlockCrypto);

        try {
            // Add transaction id to crypto block array
            adminCashierBlockCrypto.push(transactionDatabase._id.toString());

            // Create promises array
            let promises = [];

            if(data.action === 'approve') {
                // Add update crypto transaction query to promises array
                promises = [
                    CryptoTransaction.findByIdAndUpdate(transactionDatabase._id, {
                        'data.transaction': data.transactionHash,
                        state: 'completed'
                    }, { new: true }).select('state').lean()
                ];
            } else {
                // Add update crypto transaction and user query to promises array
                promises = [
                    CryptoTransaction.findByIdAndUpdate(transactionDatabase._id, {
                        state: 'canceled'
                    }, { new: true }).select('state').lean(),
                    User.findByIdAndUpdate(transactionDatabase.user, {
                        $inc: {
                            balance: transactionDatabase.amount,
                            'stats.total.withdraw': -transactionDatabase.amount,
                            'stats.crypto.withdraw': -transactionDatabase.amount
                        }
                    }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
                ];
            }

            // Execute promises array queries
            const dataDatabase = await Promise.all(promises);

            // Send updated user to frontend
            if(data.action === 'cancel') { io.of('/general').to(dataDatabase[1]._id.toString()).emit('user', { user: dataDatabase[1] }); }

            callback({ success: true, transaction: dataDatabase[0] });

            // Remove transaction id from crypto block array
            adminCashierBlockCrypto.splice(adminCashierBlockCrypto.indexOf(transactionDatabase._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            adminCashierBlockCrypto.splice(adminCashierBlockCrypto.indexOf(transactionDatabase._id.toString()), 1);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendCashierRobuxCancelSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendCashierRobuxCancelData(data);

        // Get user robux offer from the database
        const offerDatabase = await RobuxOffer.findById(data.offerId).select('amount amountProcessed type user state').lean();

        // Validate offer
        adminCheckSendCashierRobuxCancelOffer(offerDatabase, cashierRobuxGetBlockOffer());

        try {
            // Add offer id to offer block array
            cashierRobuxAddBlockOffer(offerDatabase._id.toString());

            // Create promises array
            let promises = [];

            // Add offer update query to promises array
            promises = [
                RobuxOffer.findByIdAndUpdate(offerDatabase._id, {
                    state: 'canceled'
                }, { new: true }).select('amount amountProcessed type user state createdAt').lean()
            ];

            // Add user update query to promises array if offer is withdraw
            if(offerDatabase.type === 'withdraw') {
                promises.push(
                    User.findByIdAndUpdate(offerDatabase.user, {
                        $inc: {
                            balance: Math.floor(offerDatabase.amount - offerDatabase.amountProcessed),
                            'stats.withdraw': -Math.floor(offerDatabase.amount - offerDatabase.amountProcessed)
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean()
                );
            }

            // Execute promises queries
            const dataDatabase = await Promise.all(promises);

            // Send updated user to frontend if offer is withdraw
            if(offerDatabase.type === 'withdraw') { io.of('/general').to(dataDatabase[1]._id.toString()).emit('user', { user: dataDatabase[1] }); }

            // Send updated offer to frontend
            io.of('/cashier').to(dataDatabase[0].user.toString()).emit('robuxOffer', { offer: dataDatabase[0] });

            callback({ success: true, offer: dataDatabase[0] });

            // Remove offer id from offer block array
            cashierRobuxRemoveBlockOffer(offerDatabase._id.toString());

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            socketRemoveAntiSpam(socket.decoded._id);
            cashierRobuxRemoveBlockOffer(offerDatabase._id.toString());
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendCashierCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendCashierCreateData(data);

        // Get gift reward and card count
        const reward = Math.floor(data.reward);
        const count = Math.floor(data.count);

        // Create promises array
        let promises = [];

        for(let i = 0; i < count; i++) {
            // Generate new gift code
            const generated = crypto.randomBytes(16).toString('hex').substring(0, 16).toUpperCase();

            // Add create gift code to promises array
            promises.push(
                GiftCode.create({
                    code: generated,
                    reward: reward
                })
            );
        }

        // Execute promises array queries
        let dataDatabase = await Promise.all(promises);

        // Convert code objects to javascript objects
        dataDatabase = dataDatabase.map((code) => code.toObject());

        callback({ success: true, codes: dataDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetCashierListSocket,
    adminSendCashierCryptoActionSocket,
    adminSendCashierRobuxCancelSocket,
    adminSendCashierCreateSocket
}
