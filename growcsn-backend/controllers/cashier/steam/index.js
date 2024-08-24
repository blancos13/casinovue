const mongoose = require('mongoose');

// Load database models
const User = require('../../../database/models/User');
const SteamTransaction = require('../../../database/models/SteamTransaction');
const Report = require('../../../database/models/Report');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    cashierCheckSendSteamDepositData,
    cashierSteamCreateTransaction
} = require('../../../utils/cashier/steam');

const cashierSendSteamDepositSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendSteamDepositData(data);

        // Get active user steam transaction from database
        let transactionDatabase = await SteamTransaction.findOne({ type: 'deposit', user: user._id, state: 'created', createdAt: { $gte: (new Date().getTime() - (1000 * 60)) } }).select('data type user state createdAt').lean();

        if(transactionDatabase === null) {
            // Generate transaction id
            const transactionId = new mongoose.Types.ObjectId();

            // Create body object
            let body = { deposit_id: transactionId, result_url: `${process.env.SERVER_BACKEND_URL}/callback/skinify`, priority_game: data.game };

            // Create skinify transaction
            const transactionData = await cashierSteamCreateTransaction(body);

            // Create new steam transaction in database
            transactionDatabase = await SteamTransaction.create({
                _id: transactionId,
                data: {
                    providerId: transactionData.transaction_id,
                    providerUrl: transactionData.url
                },
                type: 'deposit',
                user: user._id,
                state: 'created'
            });

            // Convert transaction to javascript object
            transactionDatabase = transactionDatabase.toObject();
        }

        callback({ success: true, transaction: transactionDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    cashierSendSteamDepositSocket
}