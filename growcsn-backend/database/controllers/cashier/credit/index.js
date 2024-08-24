// Load database models
const User = require('../../../database/models/User');
const CreditTransaction = require('../../../database/models/CreditTransaction');
const Report = require('../../../database/models/Report');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    cashierCheckSendCreditDepositData,
    cashierCreditCreateSignature,
    cashierCreditCreateTransaction,
    cashierCreditCreateUrl
} = require('../../../utils/cashier/credit');

const cashierSendCreditDepositSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendCreditDepositData(data);

        // Get active user steam transaction from database
        let transactionDatabase = await CreditTransaction.findOne({ type: 'deposit', user: user._id, state: 'created' }).select('data type user state').lean();

        if(transactionDatabase === null) {
            // Create body object
            let body = { userId: user._id.toString() };

            // Create signature and add to body
            body.signature = cashierCreditCreateSignature(body);

            // Create zebrasmarket transaction
            const transactionData = await cashierCreditCreateTransaction(body);

            // Create new credit transaction in database
            transactionDatabase = await CreditTransaction.create({
                data: {
                    providerId: transactionData.orderId,
                    providerUrl: transactionData.url
                },
                type: 'deposit',
                user: user._id,
                state: 'created'
            });

            // Convert transaction to javascript object
            transactionDatabase = transactionDatabase.toObject();
        }

        // Get sent amount
        const amount = String(Math.floor(data.amount) / 1000 * 3 / 1000);

        // Get zebrasmarket url
        const urlData = await cashierCreditCreateUrl(transactionDatabase.data.providerUrl, amount);

        callback({ success: true, url: urlData });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    cashierSendCreditDepositSocket
}