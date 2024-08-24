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

// Load controllers
const {
    adminGetStatsDataSocket,
    adminGetStatsListSocket
} = require('../../../controllers/admin/stats');

module.exports = (io, socket) => {

    socket.on('getStatsData', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban'); }
                socketCheckUserData(user, true);
                socketCheckUserRank(user, ['admin']);
                adminGetStatsDataSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

    socket.on('getStatsList', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank agreed mute ban'); }
                socketCheckUserData(user, true);
                socketCheckUserRank(user, ['admin']);
                adminGetStatsListSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

}
