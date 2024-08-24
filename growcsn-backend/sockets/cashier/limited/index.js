// Load database models
const User = require('../../../database/models/User');

// Load middleware
const {
    rateLimiter
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    socketCheckUserData,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingCheck
} = require('../../../utils/setting');

// Load controllers
const {
    cashierGetLimitedDataSocket,
    cashierSendLimitedEnableSocket,
    cashierSendLimitedVerifySocket,
    cashierSendLimitedDepositSocket,
    cashierSendLimitedWithdrawSocket
} = require('../../../controllers/cashier/limited');

module.exports = (io, socket) => {

    socket.on('getLimitedData', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('roblox.id username avatar rank proxy mute ban'); }
                socketCheckUserData(user, true);
                settingCheck(user);
                cashierGetLimitedDataSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('sendLimitedEnable', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('roblox username avatar rank proxy mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user);
                    cashierSendLimitedEnableSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendLimitedVerify', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('roblox username avatar rank proxy mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user);
                    cashierSendLimitedVerifySocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendLimitedDeposit', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('roblox username avatar rank proxy mute ban verifiedAt').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user, 'limited.deposit.enabled');
                    cashierSendLimitedDepositSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendLimitedWithdraw', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('roblox username avatar rank balance limits proxy mute ban verifiedAt').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user, 'limited.withdraw.enabled');
                    cashierSendLimitedWithdrawSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

}
