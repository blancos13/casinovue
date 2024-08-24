// Load database models
const User = require('../../../database/models/User');
const Leaderboard = require('../../../database/models/Leaderboard');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetLeaderboardListData,
    adminCheckSendLeaderboardCreateData,
    adminCheckSendLeaderboardStopData,
    adminCheckSendLeaderboardStopLeaderboard
} = require('../../../utils/admin/leaderboard');

// Load controllers
const {
    generalLeaderboardStart,
    generalLeaderboardStop
} = require('../../general/leaderboard');

const adminGetLeaderboardListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetLeaderboardListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get leaderboards and leaderboards count from database
        const dataDatabase = await Promise.all([
            Leaderboard.countDocuments({
                type: { $regex: data.search, $options: 'i' }
            }),
            Leaderboard.find({
                type: { $regex: data.search, $options: 'i' }
            }).sort({ createdAt: -1 }).limit(12).skip(offset).select('winners duration type state createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], leaderboards: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendLeaderboardCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendLeaderboardCreateData(data);

        // Get active leaderboard from database
        const leaderboardDatabase = await Leaderboard.findOne({ state: 'running' }).select('state').lean();

        // Get duration
        const duration = Math.floor(data.duration);

        // Get prizes
        const winners = data.prizes.map((prize) => ({ prize: prize.amount }));

        // Create database queries promises array
        let promises = [];

        // Add leaderboard create query to promises array
        promises = [
            Leaderboard.create({
                winners: winners,
                duration: duration,
                type: data.type,
                state: leaderboardDatabase === null ? 'running' : 'created'
            })
        ];

        // Add update users leaderboard points if new leaderboard is running
        if(leaderboardDatabase === null) {
            promises.push(
                User.updateMany({}, { 'leaderboard.points': 0 }, {})
            );
        }

        // Execute database queries in promises array
        let dataDatabase = await Promise.all(promises);
    
        dataDatabase[0] = dataDatabase[0].toObject();

        // Call leaderboard start function if created leaderboard is running
        if(dataDatabase[0].state === 'running') { generalLeaderboardStart(io, dataDatabase[0]); }

        callback({ success: true, leaderboard: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendLeaderboardStopSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendLeaderboardStopData(data);

        // Validate if the leaderboard code is in database and is active
        let dataDatabase = await Promise.all([
            Leaderboard.findById(data.leaderboardId).select('state').lean()
        ]);
        adminCheckSendLeaderboardStopLeaderboard(dataDatabase[0]);

        if(dataDatabase[0].state === 'created') {
            // Remove leaderboard from database
            dataDatabase[0] = await Leaderboard.findByIdAndDelete(data.leaderboardId);
        } else {
            // Call leaderboard stop function
            generalLeaderboardStop(io, dataDatabase[0]);

            // Update leaderboard state in database
            dataDatabase[0] = await Leaderboard.findByIdAndUpdate(data.leaderboardId, { state: 'canceled' }, { new: true });
        }

        callback({ success: true, leaderboard: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetLeaderboardListSocket,
    adminSendLeaderboardCreateSocket,
    adminSendLeaderboardStopSocket
}