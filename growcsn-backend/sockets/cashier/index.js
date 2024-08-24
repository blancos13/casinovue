const jwt = require('jsonwebtoken');

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

// Load controllers
const {
    cashierRobuxInit
} = require('../../controllers/cashier/robux');
const {
    cashierLimitedInit
} = require('../../controllers/cashier/limited');
const {
    cashierCryptoInit
} = require('../../controllers/cashier/crypto');

module.exports = (io) => {

    io.of('/cashier').use(async(socket, next) => {
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await socketCheckConnectionLimit('cashier', identifier);

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

    io.of('/cashier').on('connection', (socket) => {
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        socketAddConnectionLimit('cashier', identifier);

        require('./robux')(io, socket);
        require('./limited')(io, socket);
        require('./steam')(io, socket);
        require('./crypto')(io, socket);
        require('./gift')(io, socket);
        require('./credit')(io, socket);

        socket.on('disconnect', async() => {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            socketRemoveConnectionLimit('cashier', identifier);
        });

    });

    // Init cashier robux
    cashierRobuxInit(io);

    // Init cashier limited
    cashierLimitedInit(io);

    // Init cashier crypto
    cashierCryptoInit(io);
}
