const jwt = require('jsonwebtoken');

// Load database models
const User = require('../../database/models/User');

// Load middleware
const {
    rateLimiter,
    rateLimiterStrict
} = require('../../middleware/rateLimiter');

// Load utils
const {
    socketCheckConnectionLimit,
    socketAddConnectionLimit,
    socketRemoveConnectionLimit,
} = require('../../utils/socket');
const {
    settingGet
} = require('../../utils/setting');

module.exports = (io) => {

    io.of('/admin').use(async(socket, next) => {
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await socketCheckConnectionLimit('admin', identifier);

            if(socket.handshake.auth !== undefined && socket.handshake.auth.token !== undefined) {
                try {
                    const decoded = await jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET);
                    socket.decoded = decoded;

                    if(socket.decoded !== undefined && socket.decoded !== null && socket.decoded._id !== undefined) { socket.join(socket.decoded._id.toString()); }
                } catch(err) {
                    return next(new Error('You need to sign in to perform this action.'));
                }

                next();
            } else { next(new Error('You need to sign in to perform this action.')); }
        } catch(err) {
            return next({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    io.of('/admin').on('connection', (socket) => {
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        socketAddConnectionLimit('admin', identifier);

        require('./setting')(io, socket);
        require('./user')(io, socket);
        require('./affiliate')(io, socket);
        require('./promo')(io, socket);
        require('./filter')(io, socket);
        require('./cashier')(io, socket);
        require('./box')(io, socket);
        require('./rain')(io, socket);
        require('./leaderboard')(io, socket);
        require('./stats')(io, socket);

        socket.on('disconnect', async() => {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            socketRemoveConnectionLimit('admin', identifier);
        });

    });
}
