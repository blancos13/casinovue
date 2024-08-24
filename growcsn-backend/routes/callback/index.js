const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Load database models
const User = require('../../database/models/User');
const CryptoAddress = require('../../database/models/CryptoAddress');
const CryptoTransaction = require('../../database/models/CryptoTransaction');
const SteamTransaction = require('../../database/models/SteamTransaction');
const CreditTransaction = require('../../database/models/CreditTransaction');
const Report = require('../../database/models/Report');

// Load middleware
const {
    rateLimiterMiddleware
} = require('../../middleware/rateLimiter');

// Load utils
const {
    callbackCheckPostCoinpaymentsData,
    callbackCheckPostCoinpaymentsHmac,
    callbackCheckPostCoinpaymentsTransaction,
    callbackCheckPostSkinifyData,
    callbackCheckPostSkinifyToken,
    callbackCheckPostSkinifyTransaction,
    callbackCheckPostZebrasmarketData,
    callbackCheckPostZebrasmarketSignature,
    callbackCheckPostZebrasmarketTransaction,
    callbackCoinpaymentsCreateHmac,
    callbackZebrasmarketCreateSignature
} = require('../../utils/callback');

// Callback variables
let callbackBlockTransactionCrypto = [];
let callbackBlockTransactionCredit = [];
let callbackBlockTransactionSteam = [];

module.exports = (io) => {
    
    // @desc    Get coinpayments ipns
    // @route   POST /callback/coinpayments
    // @access  Public
    router.post('/coinpayments', rateLimiterMiddleware, async(req, res) => {
        try {
            // Validate sent data
            callbackCheckPostCoinpaymentsData(req.headers, req.body);

            // Create sha512 hmac for sent body
            const hmac = callbackCoinpaymentsCreateHmac(req.body);

            // Validate sent hmac
            callbackCheckPostCoinpaymentsHmac(hmac, req.headers);

            // Get transaction id and currency
            const transactionId = req.body.ipn_type === 'deposit' ? req.body.deposit_id : req.body.id;
            const currency = req.body.currency === 'USDT.ERC20' ? 'usdt' : req.body.currency.toLowerCase();

            // Validate crypto transaction
            callbackCheckPostCoinpaymentsTransaction(transactionId, callbackBlockTransactionCrypto);

            try {
                // Add transactions id to crypto block array
                callbackBlockTransactionCrypto.push(transactionId.toString());

                // Get crypto address and crypto transaction from database
                let dataDatabase = await Promise.all([
                    CryptoAddress.findOne({ name: currency, address: req.body.address }).select('address user').populate({ path: 'user', select: 'affiliates' }).lean(),
                    CryptoTransaction.findOne({ 'data.providerId': transactionId }).select('amount data type user state').lean()
                ]);

                if(req.body.ipn_type === 'deposit' && dataDatabase[0] !== null && dataDatabase[1] === null && req.body.status >= 100) {
                    // Create promises array
                    let promises = [];

                    // Get transaction amount in fiat
                    const amountFiat = Math.floor(req.body.fiat_amount * 1000);

                    // Get transaction amount in robux
                    const amount = Math.floor((amountFiat / 3) * 1000);

                    // Add update user and create crypto transaction queries to promises array
                    promises = [
                        User.findByIdAndUpdate(dataDatabase[0].user._id, {
                            $inc: {
                                balance: amount,
                                'stats.deposit': amount,
                                'limits.betToWithdraw': amount
                            },
                            updatedAt: new Date().getTime()
                        }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                        CryptoTransaction.create({
                            amount: amount,
                            data: {
                                providerId: transactionId,
                                transaction: req.body.txn_id,
                                currency: currency,
                                cryptoAmount: req.body.amount
                            },
                            type: 'deposit',
                            user: dataDatabase[0].user,
                            state: 'completed'
                        }),
                        Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                            $inc: {
                                'stats.total.deposit': amountFiat,
                                'stats.crypto.deposit': amountFiat
                            }
                        }, { upsert: true }),
                    ];

                    // Add update users referrer query to promises array
                    if(dataDatabase[0].user.affiliates.referrer !== undefined) {
                        promises.push(
                            User.findByIdAndUpdate(dataDatabase[0].user.affiliates.referrer, {
                                $inc: { 
                                    'affiliates.deposit': amount
                                },
                                updatedAt: new Date().getTime()
                            }, {})
                        );
                    }

                    // Execute promises array queries
                    dataDatabase = await Promise.all(promises);

                    // Convert transaction object to javascript object
                    dataDatabase[1] = dataDatabase[1].toObject();

                    // Send updated user to frontend
                    io.of('/general').to(dataDatabase[0]._id.toString()).emit('user', { user: dataDatabase[0] });

                    // Send crypto transaction to frontend
                    io.of('/cashier').to(dataDatabase[1].user.toString()).emit('cryptoTransaction', { transaction: dataDatabase[1] });
                }

                // Remove transaction id from crypto block array
                callbackBlockTransactionCrypto.splice(callbackBlockTransactionCrypto.indexOf(transactionId.toString()), 1);

                res.status(200).json({ success: true });
            } catch(err) {
                console.log(err);
                callbackBlockTransactionCrypto.splice(callbackBlockTransactionCrypto.indexOf(transactionId.toString()) , 1);
                res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Get skinify ipns
    // @route   POST /callback/skinify
    // @access  Public
    router.post('/skinify', rateLimiterMiddleware, async(req, res) => {
        try {
            // Validate sent data
            callbackCheckPostSkinifyData(req.body);

            // Create md5 encrypted token
            const token = crypto.createHash('md5').update(process.env.SKINIFY_API_KEY).digest('hex');

            // Validate sent token
            callbackCheckPostSkinifyToken(token, req.body);

            // Get transaction id
            const transactionId = req.body.transaction_id;

            // Validate steam transaction
            callbackCheckPostSkinifyTransaction(transactionId, callbackBlockTransactionSteam);

            try {
                // Add transaction id to credit block array
                callbackBlockTransactionSteam.push(transactionId.toString());

                // Get steam transaction from database
                const transactionDatabase = await SteamTransaction.findOne({ 'data.providerId': transactionId }).select('data type user state').populate({ path: 'user', select: 'affiliates' }).lean();

                if(transactionDatabase !== null && transactionDatabase.state === 'created') {
                    // Create promises array
                    let promises = [];

                    if(req.body.status === 'success') {
                        // Get transaction amount in fiat
                        const amountFiat = Math.floor(req.body.amount_converted.usd * 1000);

                        // Get transaction amount in robux
                        const amount = Math.floor((amountFiat / 3) * 1000);

                        // Add transaction, user and report update queries to promises array
                        promises = [
                            SteamTransaction.findByIdAndUpdate(transactionDatabase._id, {
                                amount: amount,
                                state: 'completed' 
                            }, {}),
                            User.findByIdAndUpdate(transactionDatabase.user._id, {
                                $inc: {
                                    balance: amount,
                                    'stats.deposit': amount,
                                    'limits.betToWithdraw': amount
                                },
                                updatedAt: new Date().getTime()
                            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                            Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                                $inc: {
                                    'stats.total.deposit': amountFiat,
                                    'stats.steam.deposit': amountFiat
                                }
                            }, { upsert: true })
                        ];

                        // Add update users referrer query to promises array
                        if(transactionDatabase.user.affiliates.referrer !== undefined) {
                            promises.push(
                                User.findByIdAndUpdate(transactionDatabase.user.affiliates.referrer, {
                                    $inc: { 
                                        'affiliates.deposit': amount
                                    },
                                    updatedAt: new Date().getTime()
                                }, {})
                            );
                        }
                    } else {
                        // Add transaction update query to promises array
                        promises = [
                            CryptoTransaction.findByIdAndUpdate(transactionDatabase._id, {
                                state: 'canceled' 
                            }, {})
                        ];
                    }

                    // Execute promises array queries
                    let dataDatabase = await Promise.all(promises);

                    // Send updated user to frontend
                    if(dataDatabase[1] !== undefined) { io.of('/general').to(dataDatabase[1]._id.toString()).emit('user', { user: dataDatabase[1] }); }
                }

                // Remove transaction id from credit block array
                callbackBlockTransactionSteam.splice(callbackBlockTransactionSteam.indexOf(transactionId.toString()), 1);

                res.status(200).json({ success: true });
            } catch(err) {
                callbackBlockTransactionSteam.splice(callbackBlockTransactionSteam.indexOf(transactionId.toString()) , 1);
                res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Get zebrasmarket ipns
    // @route   GET /callback/zebrasmarket
    // @access  Public
    router.get('/zebrasmarket', rateLimiterMiddleware, async(req, res) => {
        try {
            // Validate sent data
            callbackCheckPostZebrasmarketData(req.body);

            // Create sha256 signature for sent body
            const signature = callbackZebrasmarketCreateSignature(req.body);

            // Validate sent signature
            callbackCheckPostZebrasmarketSignature(signature, req.body);

            // Get transaction id
            const transactionId = req.body.orderId;

            // Validate credit transaction
            callbackCheckPostZebrasmarketTransaction(transactionId, callbackBlockTransactionCredit);

            try {
                // Add transaction id to credit block array
                callbackBlockTransactionCredit.push(transactionId.toString());

                // Get credit transaction from database
                const transactionDatabase = await CreditTransaction.findOne({ 'data.providerId': transactionId }).select('amount data type user state').populate({ path: 'user', select: 'affiliates' }).lean();

                if(transactionDatabase !== null && transactionDatabase.state === 'created') {
                    // Get transaction amount in fiat
                    const amountFiat = Math.floor(req.body.value * 10);

                    // Get transaction amount in robux
                    const amount = Math.floor((amountFiat / 3) * 1000);

                    // Create promises array
                    let promises = [];

                    // Add update credit transaction, user and page report queries to promises array
                    promises = [
                        CreditTransaction.findByIdAndUpdate(transactionDatabase._id, {
                            amount: amount,
                            state: 'completed'
                        }, {}),
                        User.findByIdAndUpdate(transactionDatabase.user._id, {
                            $inc: {
                                balance: amount,
                                'stats.deposit': amount,
                                'limits.betToWithdraw': amount
                            },
                            updatedAt: new Date().getTime()
                        }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                        Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                            $inc: {
                                'stats.total.deposit': amountFiat,
                                'stats.credit.deposit': amountFiat
                            }
                        }, { upsert: true })
                    ];

                    // Add update users referrer query to promises array
                    if(transactionDatabase.user.affiliates.referrer !== undefined) {
                        promises.push(
                            User.findByIdAndUpdate(transactionDatabase.user.affiliates.referrer, {
                                $inc: { 
                                    'affiliates.deposit': amount
                                },
                                updatedAt: new Date().getTime()
                            }, {})
                        );
                    }

                    // Execute promises array queries
                    const dataDatabase = await Promise.all(promises);

                    // Send updated user to frontend
                    io.of('/general').to(dataDatabase[1]._id.toString()).emit('user', { user: dataDatabase[1] });
                }

                // Remove transaction id from credit block array
                callbackBlockTransactionCredit.splice(callbackBlockTransactionCredit.indexOf(transactionId.toString()), 1);

                res.status(200).json({ success: true });
            } catch(err) {
                callbackBlockTransactionCredit.splice(callbackBlockTransactionCredit.indexOf(transactionId.toString()) , 1);
                res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    return router;

}