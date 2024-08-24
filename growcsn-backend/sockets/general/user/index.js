// Load database models
const User = require('../../../database/models/User');

// Load middleware
const {
    rateLimiter
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    socketCheckUserData,
    socketCheckUserRank,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingCheck
} = require('../../../utils/setting');

// Load controllers
const {
    generalGetUserInfoSocket,
    generalGetUserBetsSocket,
    generalGetUserTransactionsSocket,
    generalGetUserSeedSocket,
    generalSendUserAnonymousSocket,
    generalSendUserDiscordSocket,
    generalSendUserSeedSocket,
    generalSendUserTipSocket
} = require('../../../controllers/general/user');

module.exports = (io, socket) => {

    socket.on('getUserInfo', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean(); }
                socketCheckUserData(user, true);
                settingCheck(user);
                generalGetUserInfoSocket(io, socket, user, data, callback);
           } catch(err) {
               callback({ success: false, error: { type: 'error', message: err.message } });
           }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('getUserBets', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean(); }
                socketCheckUserData(user, true);
                settingCheck(user);
                generalGetUserBetsSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('getUserTransactions', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean(); }
                socketCheckUserData(user, true);
                settingCheck(user);
                generalGetUserTransactionsSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('getUserSeed', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean(); }
                socketCheckUserData(user, true);
                settingCheck(user);
                generalGetUserSeedSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('sendUserAnonymous', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user);
                    generalSendUserAnonymousSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendUserDiscord', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('discordId username avatar rank mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user);
                    generalSendUserDiscordSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendUserSeed', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user);
                    generalSendUserSeedSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendUserTip', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank balance stats limits mute ban').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user, 'general.tip.enabled');
                    generalSendUserTipSocket(io, socket, user, data, callback);
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
