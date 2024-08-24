// Load database models
const User = require('../../../database/models/User');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    generalCheckSendVaultDepositData,
    generalCheckSendVaultDepositUser,
    generalCheckSendVaultWithdrawData,
    generalCheckSendVaultWithdrawUser,
    generalCheckSendVaultLockData,
    generalCheckSendVaultLockUser
} = require('../../../utils/general/vault');

const generalSendVaultDepositSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendVaultDepositData(data);

        // Validate user
        generalCheckSendVaultDepositUser(data, user);

        // Get user deposit amount
        const amount = Math.floor(data.amount);

        // Update user in database
        const userDatabase = await User.findByIdAndUpdate(user._id, {
            $inc: {
                balance: -amount,
                'vault.amount': amount
            },
            updatedAt: new Date().getTime()
        }, { new: true }).select('balance vault').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendVaultWithdrawSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendVaultWithdrawData(data);

        // Validate user
        generalCheckSendVaultWithdrawUser(data, user);

        // Get user withdraw amount
        const amount = Math.floor(data.amount);

        // Update user in database
        const userDatabase = await User.findByIdAndUpdate(user._id, {
            $inc: {
                balance: amount,
                'vault.amount': -amount
            },
            updatedAt: new Date().getTime()
        }, { new: true }).select('balance vault').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendVaultLockSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendVaultLockData(data);

        // Validate user
        generalCheckSendVaultLockUser(user);

        // Get vault lock time
        const time = Math.floor(data.time);

        // Update user in database
        const userDatabase = await User.findByIdAndUpdate(user._id, {
            'vault.expireAt': new Date().getTime() + time,
            updatedAt: new Date().getTime()
        }, { new: true }).select('balance vault').lean();

        callback({ success: true, user: userDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    generalSendVaultDepositSocket,
    generalSendVaultWithdrawSocket,
    generalSendVaultLockSocket
}