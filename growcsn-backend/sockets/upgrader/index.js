const jwt = require('jsonwebtoken');

// Load database models
const User = require('../../database/models/User');

// Load middleware
const {
    rateLimiter
} = require('../../middleware/rateLimiter');

// Load utils
const {
    socketCheckUserData,
    socketCheckConnectionLimit,
    socketAddConnectionLimit,
    socketRemoveConnectionLimit,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
} = require('../../utils/socket');
const {
    settingCheck
} = require('../../utils/setting');

// Load controllers
const {
    upgraderGetItemListSocket,
    upgraderSendBetSocket
} = require('../../controllers/upgrader');

module.exports = (io) => {

    io.of('/upgrader').use(async(socket, next) => {
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await socketCheckConnectionLimit('upgrader', identifier);

            if(socket.handshake.auth !== undefined && socket.handshake.auth.token !== undefined) {
                try {
                    const decoded = await jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET);
                    socket.decoded = decoded;

                    if(socket.decoded !== undefined && socket.decoded !== null && socket.decoded._id !== undefined) { socket.join(socket.decoded._id.toString()); }
                } catch(err) {
                    return next(new Error('You need to sign in to perform this action.'));
                }
            }

            next();
        } catch(err) {
            return next({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    io.of('/upgrader').on('connection', (socket) => {
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        socketAddConnectionLimit('upgrader', identifier);

        socket.on('getItemList', async(data, callback) => {
            if(callback === undefined || typeof callback !== 'function') { return; }
            try {
                const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                await rateLimiter.consume(identifier);
                try {
                    let user = null;
                    if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank mute ban'); }
                    socketCheckUserData(user, false);
                    settingCheck(user);
                    upgraderGetItemListSocket(io, socket, user, data, callback);
                } catch(err) {
                    callback({ success: false, error: { type: 'error', message: err.message } });
                }
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
            }
        });

        socket.on('sendBet', async(data, callback) => {
            if(callback === undefined || typeof callback !== 'function') { return; }
            if(socket.decoded !== undefined && socket.decoded !== null) {
                try {
                    const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
                    await rateLimiter.consume(identifier);
                    await socketCheckAntiSpam(socket.decoded._id);
                    try {
                        const user = await User.findById(socket.decoded._id).select('roblox.id username avatar rank balance xp stats limits affiliates anonymous mute ban createdAt').lean();
                        socketCheckUserData(user, true);
                        settingCheck(user, 'games.upgrader.enabled');
                        upgraderSendBetSocket(io, socket, user, data, callback);
                    } catch(err) {
                        socketRemoveAntiSpam(socket.decoded._id);
                        callback({ success: false, error: { type: 'error', message: err.message } });
                    }
                } catch(err) {
                    callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
                }
            } else { callback({ success: false, error: { type: 'error', message: 'You need to sign in to perform this action.' } }); }
        });

        socket.on('disconnect', async() => {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            socketRemoveConnectionLimit('upgrader', identifier);
        });

    });
}