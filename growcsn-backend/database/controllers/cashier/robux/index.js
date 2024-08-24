// Load database models
const User = require('../../../database/models/User');
const RobuxOffer = require('../../../database/models/RobuxOffer');
const RobuxTransaction = require('../../../database/models/RobuxTransaction');
const Report = require('../../../database/models/Report');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    authRobloxGetToken
} = require('../../../utils/auth/roblox');
const {
    cashierCheckGetRobuxData,
    cashierCheckGetRobuxDataRoblox,
    cashierCheckSendRobuxDepositData,
    cashierCheckSendRobuxDepositRoblox,
    cashierCheckSendRobuxDepositUser,
    cashierCheckSendRobuxWithdrawData,
    cashierCheckSendRobuxWithdrawRoblox,
    cashierCheckSendRobuxWithdrawUser,
    cashierCheckSendRobuxCancelData,
    cashierCheckSendRobuxCancelRoblox,
    cashierCheckSendRobuxCancelOffer,
    cashierRobuxGetBlockOffer,
    cashierRobuxAddBlockOffer,
    cashierRobuxRemoveBlockOffer,
    cashierRobuxSortOffers,
    cashierGetUserRobux,
    cashierRobuxGetGameId,
    cashierRobuxGetProducts,
    cashierRobuxGetProduct,
    cashierRobuxCreateProduct,
    cashierRobuxUpdateProduct,
    cashierRobuxPurchaseProduct
} = require('../../../utils/cashier/robux');

const cashierGetRobuxDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckGetRobuxData(data);

        // Validate user roblox
        cashierCheckGetRobuxDataRoblox(user);

        // Calculating database query offset
        const offset = (data.page - 1) * 8;

        // Get robux offers from database
        const dataDatabase = await Promise.all([
            RobuxOffer.countDocuments({ type: data.type, user: user._id }),
            RobuxOffer.find({ type: data.type, user: user._id }).sort({ createdAt: -1 }).limit(8).skip(offset).select('amount amountProcessed type user state createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], offers: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierSendRobuxDepositSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendRobuxDepositData(data);

        // Validate user roblox
        cashierCheckSendRobuxDepositRoblox(user);

        // Get user deposit offer from database
        const offersDatabase = await RobuxOffer.find({ type: 'deposit', user: user._id, state: 'created' }).select('amount amountProcessed type user state').lean();

        // Get user total active offer amount
        const cashierUserOfferAmount = offersDatabase.reduce((a, b) => b.amount - b.amountProcessed + a, 0);

        // Get users roblox robux amount
        const robuxData = await cashierGetUserRobux(user.proxy, user.roblox.cookie);

        // Validate depositing user
        cashierCheckSendRobuxDepositUser(data, cashierUserOfferAmount, robuxData);

        // Get sent amount
        const amount = Math.floor(data.amount);

        // Create new user deposit offer in database
        let offerDatabase = await RobuxOffer.create({
            amount: amount,
            type: 'deposit',
            user: user._id,
            state: 'created'
        });

        // Convert offer to javascript object
        offerDatabase = offerDatabase.toObject();

        callback({ success: true, offer: offerDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: err.relogin === undefined ? { type: 'error', message: err.message } : { type: 'error', message: 'Your roblox session has been expired. Please login again.', relogin: true } });
    }
}

const cashierSendRobuxWithdrawSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendRobuxWithdrawData(data);

        // Validate user roblox
        cashierCheckSendRobuxWithdrawRoblox(user);

        // Validate depositing user
        cashierCheckSendRobuxWithdrawUser(user, data);

        // Get user token
        const token = await authRobloxGetToken(user.proxy, user.roblox.cookie);

        // Get users game id from roblox api
        const gameId = await cashierRobuxGetGameId(user.proxy, user.roblox.cookie, user.roblox.id);

        // Get users dev products
        const productsData = await cashierRobuxGetProducts(user.proxy, user.roblox.cookie, gameId);

        // Create new dev product with roblox api if no dev product is available
        if(productsData.some((element) => element.name === 'wonderfulbeginnerbackpackapple') !== true) { 
            await cashierRobuxCreateProduct(token, user.proxy, user.roblox.cookie, gameId, 'wonderfulbeginnerbackpackapple', 100); 
        }

        // Get sent amount
        const amount = Math.floor(data.amount);

        // Update user and create new user withdraw offer in database
        let dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    'stats.withdraw': amount
                },
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            RobuxOffer.create({
                amount: amount,
                type: 'withdraw',
                user: user._id,
                state: 'created'
            })
        ]);

        // Convert offer to javascript object
        dataDatabase[1] = dataDatabase[1].toObject();

        // Send updated user to frontend
        io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

        callback({ success: true, offer: dataDatabase[1] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.relogin === undefined ? err.message : 'Your roblox session has been expired. Please login again.' } });
    }
}

const cashierSendRobuxCancelSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendRobuxCancelData(data);

        // Validate user roblox
        cashierCheckSendRobuxCancelRoblox(user);

        // Get user robux offer from the database
        const offerDatabase = await RobuxOffer.findById(data.offerId).select('amount amountProcessed type user state').lean();

        // Validate offer
        cashierCheckSendRobuxCancelOffer(offerDatabase, cashierRobuxGetBlockOffer());

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
                    User.findByIdAndUpdate(user._id, {
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
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierRobuxCheckPending = async(io) => {
    try {
        // Get robux offers from database
        const offersDatabase = await RobuxOffer.find({ $or: [{ state: 'created' }, { state: 'pending' }] }).sort({ updatedAt: 1 }).select('amount amountProcessed type user state createdAt').lean();

        // Get all deposit offers if available
        let offersDeposit = cashierRobuxSortOffers(offersDatabase.filter((element) => element.type === 'deposit' && cashierRobuxGetBlockOffer().includes(element._id.toString()) === false));

        // Get next withdraw offer if available
        let offerWithdraw = cashierRobuxSortOffers(offersDatabase.filter((element) => element.type === 'withdraw' && cashierRobuxGetBlockOffer().includes(element._id.toString()) === false))[0];

        if(offersDeposit.length >= 1 && offerWithdraw !== undefined) {
            // Add withdraw offer id to offer block array
            cashierRobuxAddBlockOffer(offerWithdraw._id.toString());

            // Create offer and transaction promises array
            let promisesOffers = [];
            let promisesTransactions = [];

            for(let deposit of offersDeposit) {
                // Add deposit offer id to offer block array
                cashierRobuxAddBlockOffer(deposit._id.toString());

                // Get left deposit offer amount
                const amountDepositLeft = deposit.amount - deposit.amountProcessed;

                // Get left deposit offer amount
                const amountWithdrawLeft = offerWithdraw.amount - offerWithdraw.amountProcessed;

                // Get transaction amount 
                const amountTransaction = amountDepositLeft < amountWithdrawLeft ? amountDepositLeft : amountWithdrawLeft;

                // Update deposit offer amount and withdraw offer amount
                deposit.amountProcessed = deposit.amountProcessed + amountTransaction;
                offerWithdraw.amountProcessed = offerWithdraw.amountProcessed + amountTransaction;

                // Add deposit offer update query to offers promise array
                promisesOffers.push(
                    RobuxOffer.findByIdAndUpdate(deposit._id, {
                        amountProcessed: deposit.amountProcessed,
                        state: 'pending'
                    }, { new: true }).select('amount amountProcessed user').lean()
                );

                // Add transaction create query to transactions promise array
                promisesTransactions.push(
                    RobuxTransaction.create({
                        amount: amountTransaction,
                        deposit: { user: deposit.user._id, offer: deposit._id },
                        withdraw: { user: offerWithdraw.user._id, offer: offerWithdraw._id },
                        state: 'created'
                    })
                );

                // Stop deposit offers loop if withdraw offer amount is zero or less
                if(offerWithdraw.amount <= offerWithdraw.amountProcessed) { break; }
            }

            // Add withdraw offer update query to offers promise array
            promisesOffers.push(
                RobuxOffer.findByIdAndUpdate(offerWithdraw._id, {
                    amountProcessed: offerWithdraw.amountProcessed,
                    state: 'pending'
                }, { new: true }).select('amount amountProcessed user').lean()
            );

            // Execute offer and transaction queries
            const dataDatabase = await Promise.all([ ...promisesOffers, ...promisesTransactions ]);

            // Format transaction object to javascript object
            let transactions = dataDatabase.slice(promisesOffers.length).map((transaction) => transaction.toObject());

            for(const offer of dataDatabase.slice(0, promisesOffers.length)) { 
                // Remove offer ids from offer block array
                cashierRobuxRemoveBlockOffer(offer._id.toString());

                // Get transactions index for offer
                const index = transactions.findIndex((element) => element.deposit.offer._id.toString() === offer._id.toString());

                // Add offer to transaction
                if(index !== -1) { transactions[index].deposit.offer = offer; }

                // Send updated offer to frontend
                io.of('/cashier').to(offer.user.toString()).emit('robuxOffer', { offer: offer });
            }

            // Create robux transactions group
            const group = { user: offerWithdraw.user, offer: offerWithdraw, transactions: transactions };

            // Handle grouped robux transactions
            cashierRobuxHandleGroup(io, group);
        } else { setTimeout(() => { cashierRobuxCheckPending(io); }, 1000 * 10); }
    } catch(err) {
        setTimeout(() => { cashierRobuxCheckPending(io); }, 1000 * 10);
    }
}

const cashierRobuxHandleGroup = async(io, group) => {
    try {
        // Add user roblox id, roblox cookie and proxy to group
        group.user = await User.findById(group.user._id).select('roblox proxy');

        // Get group user token
        group.user.token = await authRobloxGetToken(group.user.proxy, group.user.roblox.cookie);

        // Get users game id from roblox api
        group.gameId = await cashierRobuxGetGameId(group.user.proxy, group.user.roblox.cookie, group.user.roblox.id);

        // Get users dev products
        const productsData = await cashierRobuxGetProducts(group.user.proxy, group.user.roblox.cookie, group.gameId);

        // Get index of product with name
        group.product = productsData[productsData.findIndex((element) => element.name === 'wonderfulbeginnerbackpackapple')];

        // Set group robux dev product
        group.product = group.product !== undefined ? await cashierRobuxGetProduct(group.user.proxy, group.user.roblox.cookie, group.product.id) : null;

        // Handle transactions if dev product is available
        if(group.product !== null) { 
            cashierRobuxHandleTransaction(io, 0, group); 
        } else { cashierRobuxCancelGroup(io, group); }
    } catch(err) {
        cashierRobuxCancelGroup(io, group);
    }
}

const cashierRobuxHandleTransaction = async(io, index, group) => {
    try {
        // Add withdraw user roblox cookie and proxy to transaction 
        group.transactions[index].deposit.user = await User.findById(group.transactions[index].deposit.user).select('roblox.cookie affiliates proxy');

        if(group.user._id.toString() !== group.transactions[index].deposit.user._id.toString()) {
            // Get dev product price amount
            const amountPrice = Math.floor(group.transactions[index].amount / 1000);

            // Update dev product price
            await cashierRobuxUpdateProduct(
                group.user.token, 
                group.user.proxy, 
                group.user.roblox.cookie, 
                group.gameId,
                group.product.id,
                'wonderfulbeginnerbackpackapple', 
                amountPrice
            );

            // Get deposit user token
            const tokenDeposit = await authRobloxGetToken(group.transactions[index].deposit.user.proxy, group.transactions[index].deposit.user.roblox.cookie);

            // Purchase dev product from user
            await cashierRobuxPurchaseProduct(
                tokenDeposit, 
                group.transactions[index].deposit.user.proxy, 
                group.transactions[index].deposit.user.roblox.cookie, 
                group.product.id, 
                amountPrice, 
                group.user.roblox.id
            );
        }

        // Get transaction amount in fiat
        const amountFiat = Math.floor((group.transactions[index].amount / 1000) * 3);

        // Create promises array
        let promises = [];

        // Add update user, transaction and site report queries to promises array
        promises = [
            User.findByIdAndUpdate(group.transactions[index].deposit.user._id, {
                $inc: {
                    balance: group.transactions[index].amount,
                    'stats.deposit': group.transactions[index].amount,
                    'limits.betToWithdraw': group.transactions[index].amount
                }
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            RobuxTransaction.findByIdAndUpdate(group.transactions[index]._id, {
                'data.productId': group.product.targetId,
                state: 'completed'
            }, { new: true }).lean(),
            Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                $inc: {
                    'stats.total.deposit': amountFiat,
                    'stats.total.withdraw': amountFiat,
                    'stats.robux.deposit': amountFiat,
                    'stats.robux.withdraw': amountFiat
                }
            }, { upsert: true })
        ];

        // Add update users referrer query to promises array
        if(group.transactions[index].deposit.user.affiliates.referrer !== undefined) {
            promises.push(
                User.findByIdAndUpdate(group.transactions[index].deposit.user.affiliates.referrer, {
                    $inc: { 
                        'affiliates.deposit': group.transactions[index].amount
                    },
                    updatedAt: new Date().getTime()
                }, {})
            );
        }

        // Add update deposit offer if it is completed
        if(group.transactions[index].deposit.offer.amount <= group.transactions[index].deposit.offer.amountProcessed) {
            promises.push(
                RobuxOffer.findByIdAndUpdate(group.transactions[index].deposit.offer._id, {
                    state: 'completed'
                }, { new: true }).lean()
            );
        }

        // Add update withdraw offer query to promises array if it is completed
        if((index + 1) === group.transactions.length && group.offer.amount === group.offer.amountProcessed) {
            promises.push(
                RobuxOffer.findByIdAndUpdate(group.offer._id, {
                    state: 'completed'
                }, { new: true }).lean()
            );
        }

        // Execute promies array queries
        const dataDatabase = await Promise.all(promises);

        // Send updated user to frontend
        io.of('/general').to(dataDatabase[0]._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send updated robux offers to frontend
        for(const offer of dataDatabase.slice(group.transactions[index].deposit.user.affiliates.referrer !== undefined ? 4 : 3)) { io.of('/cashier').to(offer.user.toString()).emit('robuxOffer', { offer: offer }); }

        // Handle next transaction if available
        if((index + 1) < group.transactions.length) { 
            cashierRobuxHandleTransaction(io, index + 1, group); 
        } else { setTimeout(() => { cashierRobuxCheckPending(io); }, 1000); }
    } catch(err) {
        cashierRobuxCancelTransaction(io, index, group);
    }
}

const cashierRobuxCancelGroup = async(io, group) => {
    try {
        // Create promises arrays
        let promisesTransactions = [];
        let promisesOffers = [];

        // Create total amount variable
        let amountTotal = 0;

        for(const transaction of group.transactions) {
            // Add transaction amount to total amount
            amountTotal = amountTotal + transaction.amount;

            // Add update robux transaction query to transactions promises array
            promisesTransactions.push(
                RobuxTransaction.findByIdAndUpdate(transaction._id, {
                    state: 'canceled'
                }, { new: true }).select('amount state').lean()
            );

            // Add update robux deposit offer query to offers promises array
            promisesOffers.push(
                RobuxOffer.findByIdAndUpdate(transaction.deposit.offer._id, {
                    $inc: {
                        amountProcessed: -transaction.amount
                    }
                }, { new: true }).select('amount amountProcessed type user state createdAt').lean()
            );
        }

        // Add update robux withdraw offer query to offers promises array
        promisesOffers.push(
            RobuxOffer.findByIdAndUpdate(group.offer, {
                $inc: {
                    amountProcessed: -amountTotal
                },
                state: 'canceled'
            }, { new: true }).select('amount amountProcessed type user state createdAt').lean()
        );

        // Execute update user and promises array queries
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(group.user._id, {
                $inc: {
                    balance: Math.floor(group.offer.amount - group.offer.amountProcessed + amountTotal),
                    'stats.withdraw': -Math.floor(group.offer.amount - group.offer.amountProcessed + amountTotal)
                }
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            ...promisesTransactions,
            ...promisesOffers
        ]);

        // Send updated user to frontend
        io.of('/general').to(dataDatabase[0]._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send updated robux offers to frontend
        for(const offer of dataDatabase.slice(promisesTransactions.length + 1)) { io.of('/cashier').to(offer.user.toString()).emit('robuxOffer', { offer: offer }); }

        setTimeout(() => { cashierRobuxCheckPending(io); }, 1000);
    } catch(err) {
        console.error(err);
        setTimeout(() => { cashierRobuxCheckPending(io); }, 1000 * 10);
    }
}

const cashierRobuxCancelTransaction = async(io, index, group) => {
    try {
        // Update user and robux transaction in database
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(group.user._id, {
                $inc: {
                    balance: group.transactions[index].amount,
                    'stats.withdraw': -group.transactions[index].amount
                }
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            RobuxTransaction.findByIdAndUpdate(group.transactions[index]._id, {
                state: 'canceled'
            }, { new: true }).select('amount state').lean(),
            RobuxOffer.findByIdAndUpdate(group.transactions[index].deposit.offer._id, {
                $inc: {
                    amountProcessed: -group.transactions[index].amount
                },
                state: 'canceled'
            }, { new: true }).select('amount amountProcessed type user state createdAt').lean()
        ]);

        // Send updated user to frontend
        io.of('/general').to(dataDatabase[0]._id.toString()).emit('user', { user: dataDatabase[0] });

        // Send updated offer to frontend
        io.of('/cashier').to(dataDatabase[2].user.toString()).emit('robuxOffer', { offer: dataDatabase[2] });

        // Handle next transaction if available
        if((index + 1) < group.transactions.length) { 
            cashierRobuxHandleTransaction(io, index + 1, group); 
        } else { setTimeout(() => { cashierRobuxCheckPending(io); }, 1000); }
    } catch(err) {
        console.error(err);
        setTimeout(() => { cashierRobuxCheckPending(io); }, 1000 * 10);
    }
}

const cashierRobuxInit = async(io) => {
    try {
        // Get created robux transactions from database
        const transactionsDatabase = await RobuxTransaction.find({ state: 'created' }).select('amount deposit withdraw state').lean();

        // Handle created and grouped robux transactions
        for(const transaction of transactionsDatabase) { 
            await Promise.all([
                User.findByIdAndUpdate(transaction.withdraw.user._id, {
                    $inc: {
                        balance: transaction.amount,
                        'stats.withdraw': -transaction.amount
                    }
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                RobuxTransaction.findByIdAndUpdate(transaction._id, {
                    state: 'canceled'
                }, { new: true }).select('amount state').lean()
            ]);
        }

        // Check for pending robux offers
        cashierRobuxCheckPending(io);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    cashierGetRobuxDataSocket,
    cashierSendRobuxDepositSocket,
    cashierSendRobuxWithdrawSocket,
    cashierSendRobuxCancelSocket,
    cashierRobuxInit
}
