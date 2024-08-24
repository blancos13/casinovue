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
const {
    generalGetChatOnlineCount
} = require('../../utils/general/chat');
const {
    requestRemoveProxy
} = require('../../utils/request');

// Load controllers
const {
    generalBetsInit
} = require('../../controllers/general/bets');
const {
    generalChatInit
} = require('../../controllers/general/chat');
const {
    generalGetRains,
    generalRainInit
} = require('../../controllers/general/rain');

module.exports = (io) => {

    io.of('/general').use(async(socket, next) => {
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await socketCheckConnectionLimit('general', identifier);

            if(socket.handshake.auth !== undefined && socket.handshake.auth.token !== undefined) {
                try {
                    const decoded = await jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET);
                    socket.decoded = decoded;

                    if(socket.decoded !== undefined && socket.decoded !== null && socket.decoded._id !== undefined) { socket.join(socket.decoded._id.toString()); }
                } catch(err) {
                    return next(new Error('You need to sign in to perform this action.'));
                }
            }

            // Get the chat room online count and the current active rains
            const generalData = await Promise.all([ generalGetChatOnlineCount(io), generalGetRains() ]);

            socket.emit('init', { settings: settingGet(), online: generalData[0], rains: generalData[1], time: new Date().getTime() });
            next();
        } catch(err) {
            return next({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    io.of('/general').on('connection', (socket) => {
        const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
        socketAddConnectionLimit('general', identifier);

        require('./bets')(io, socket);
        require('./chat')(io, socket);
        require('./user')(io, socket);
        require('./vault')(io, socket);
        require('./affiliate')(io, socket);
        require('./rakeback')(io, socket);
        require('./promo')(io, socket);
        require('./rain')(io, socket);
        require('./leaderboard')(io, socket);

        socket.on('disconnect', async() => {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            socketRemoveConnectionLimit('general', identifier);
            
            // Remove user proxy and add back to available proxy list
            requestRemoveProxy(identifier);

            // Get chat room online count and send to frontend
            const onlineData = await generalGetChatOnlineCount(io);
            io.of('/general').emit('chatOnline', { online: onlineData });
        });

    });

    // Init chat
    setTimeout(() => { generalChatInit(io); }, 3000);

    // Init bets
    generalBetsInit();

    // Init rain
    generalRainInit(io);
}
