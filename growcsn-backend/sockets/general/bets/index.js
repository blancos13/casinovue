// Load database models
const User = require('../../../database/models/User');

// Load middleware
const {
    rateLimiter
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    socketCheckUserData
} = require('../../../utils/socket');
const {
    settingCheck
} = require('../../../utils/setting');

// Load controllers
const {
    generalGetBetsDataSocket
} = require('../../../controllers/general/bets');

module.exports = (io, socket) => {

    socket.on('getBetsData', async(data, callback) => {
        if(callback === undefined || typeof callback !== 'function') { return; }
        try {
            const identifier = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;
            await rateLimiter.consume(identifier);
            try {
                let user = null;
                if(socket.decoded !== undefined && socket.decoded !== null) { user = await User.findById(socket.decoded._id).select('username avatar rank mute ban').lean(); }
                socketCheckUserData(user, false);
                settingCheck(user);
                generalGetBetsDataSocket(io, socket, user, data, callback);
            } catch(err) {
                callback({ success: false, error: { type: 'error', message: err.message } });
            }
        } catch(err) {
            callback({ success: false, error: { type: 'error', message: err.message !== undefined ? err.message : 'You need to slow down, you have send to many request. Try again in a minute.' } });
        }
    });

}