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
    generalGetChatMessagesSocket,
    generalSendChatMessageSocket,
    generalSendChatRemoveSocket,
    generalSendChatClearSocket,
    generalSendChatLockSocket,
} = require('../../../controllers/general/chat');

module.exports = (io, socket) => {

    socket.on('getChatMessages', async(data, callback) => {
       if(callback === undefined || typeof callback !== 'function') { return; }
       try {
           const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
           await rateLimiter.consume(identifier);
           try {
               let user = null;
               if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean(); }
               socketCheckUserData(user, false);
               settingCheck(user);
               generalGetChatMessagesSocket(io, socket, user, data, callback);
           } catch(err) {
               callback({ success: false, error: { type: 'error', message: err.message } });
           }
       } catch(err) {
           callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
       }
   });

    socket.on('sendChatMessage', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('roblox.id username avatar rank xp stats anonymous mute ban createdAt').lean();
                    socketCheckUserData(user, true);
                    settingCheck(user, 'chat.enabled');
                    generalSendChatMessageSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendChatRemove', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean();
                    socketCheckUserData(user, true);
                    socketCheckUserRank(user, ['admin', 'mod']);
                    settingCheck(user);
                    generalSendChatRemoveSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendChatClear', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean();
                    socketCheckUserData(user, true);
                    socketCheckUserRank(user, ['admin', 'mod']);
                    settingCheck(user);
                    generalSendChatClearSocket(io, socket, user, data, callback);
                } catch(err) {
                    socketRemoveAntiSpam(socket.decoded._id);
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
    });

    socket.on('sendChatLock', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        if(socket.decoded !== undefined && socket.decoded !== null) {
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                await socketCheckAntiSpam(socket.decoded._id);
                try {
                    const user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban').lean();
                    socketCheckUserData(user, true);
                    socketCheckUserRank(user, ['admin', 'mod']);
                    settingCheck(user);
                    generalSendChatLockSocket(io, socket, user, data, callback);
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
