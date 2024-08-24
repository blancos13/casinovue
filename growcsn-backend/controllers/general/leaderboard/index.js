// Load database models
const User = require('../../../database/models/User');
const Leaderboard = require('../../../database/models/Leaderboard');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');

// Load utils
const {
    generalUserGetFormated
} = require('../../../utils/general/user');
const {
    generalGetLeaderboardTimeLeft
} = require('../../../utils/general/leaderboard');

// General leaderboard variables
let generalLeaderboardTimeout = null;

const generalGetLeaderboardDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get current leaderboard and top 100 users from database
        let dataDatabase = await Promise.all([
            Leaderboard.findOne({ state: 'running' }).select('winners duration type state updatedAt').lean(),
            User.find({}).sort({ 'leaderboard.points': -1 }).limit(50).select('roblox.id username avatar rank xp stats leaderboard rakeback anonymous createdAt').lean()
        ]);

        // Format leaderboard data and leaderboard users
        if(dataDatabase[0] !== null) {
            dataDatabase[0].winners = dataDatabase[0].winners.map((element, index) => ({ 
                prize: element.prize, 
                points: dataDatabase[1][index] !== undefined ? dataDatabase[1][index].leaderboard.points : 0,
                user: dataDatabase[1][index] !== undefined ? generalUserGetFormated(dataDatabase[1][index]) : undefined
            }));
        }

        callback({ success: true, leaderboard: dataDatabase[0] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalLeaderboardStart = async(io, leaderboard) => {
    try {
        // Get time left until leaderboard is completed
        const left = generalGetLeaderboardTimeLeft(leaderboard);

        // Set leaderboard timeout and call leaderboard complete function after the left time
        generalLeaderboardTimeout = setTimeout(() => { generalLeaderboardComplete(io, leaderboard); }, left);
    } catch(err) {
        console.error(err);
    }
}

const generalLeaderboardStop = async(io, leaderboard) => {
    try {
        // Clear current leaderboard timeout
        clearTimeout(generalLeaderboardTimeout);
    } catch(err) {
        console.error(err);
    }
}

const generalLeaderboardComplete = async(io, leaderboard) => {
    try {
        // Clear current leaderboard timeout
        clearTimeout(generalLeaderboardTimeout);

        // Get active leaderboard, new leaderboard if available and top 10 users for current leaderboard from database
        let dataDatabase = await Promise.all([
            Leaderboard.findById(leaderboard._id).select('winners state updatedAt').lean(),
            Leaderboard.findOne({ state: 'created' }).sort({ createdAt: 1 }).select('state updatedAt').lean(),
            User.find({}).sort({ 'leaderboard.points': -1 }).limit(10).select('leaderboard').lean()
        ]);

        // Create winners and database query promises arrays 
        let winners = [];
        let promises = [];

        for(let i; i < dataDatabase[0].winners.length; i++) {
            if(dataDatabase[2][i] !== undefined || dataDatabase[2][i] !== null) {
                // Add formated winner object for the win position to the winners array
                winners.push({ prize: dataDatabase[0].winners[i].prize, points: dataDatabase[2][i].leaderboard.points, user: dataDatabase[2][i]._id });
                
                // Add user update and balance create querys to promise array
                promises.push(
                    User.findByIdAndUpdate(dataDatabase[2][i]._id, {
                        $inc: {
                            balance: dataDatabase[0].winners[i].prize
                        },
                        updatedAt: new Date().getTime()
                    }, { new: true }).select('balance updatedAt').lean(),
                    BalanceTransaction.create({
                        amount: dataDatabase[0].winners[i].price,
                        type: 'leaderboardPayout',
                        user: dataDatabase[2][i]._id,
                        state: 'completed'
                    })
                );
            } else {
                // Add formated winner object for the win position to the winners array
                winners.push({ prize: dataDatabase[0].winners[i].prize, points: 0 });
            }
        }

        // Update leaderboard and execute querys from promise array in database
        await Promise.all([
            Leaderboard.findByIdAndUpdate(leaderboard._id, { winners: winners, state: 'completed', updatedAt: new Date().getTime() }, {}),
            ...promises
        ]);

        if(dataDatabase[1] !== null) { 
            // Update the new leaderboard and all users leaderboard points in database
            dataDatabase = await Promise.all([
                Leaderboard.findByIdAndUpdate(dataDatabase[1]._id, {
                    state: 'running',
                    updatedAt: new Date().getTime()
                }, { new: true }).select('duration state updatedAt').lean(),
                User.updateMany({}, { 'leaderboard.points': 0 }, {})
            ]);

            // Call leaderboard start function
            generalLeaderboardStart(io, dataDatabase[0]); 
        }
    } catch(err) {
        console.error(err);
    }
}

const generalLeaderboardInit = async(io) => {
    try {
        // Get active leaderboard and new leaderboard if available from database
        let dataDatabase = await Promise.all([
            Leaderboard.findOne({ state: 'running' }).select('duration state updatedAt').lean(),
            Leaderboard.findOne({ state: 'created' }).sort({ createdAt: 1 }).select('duration state updatedAt').lean()
        ]);

        if(dataDatabase[0] !== null) {
            // Get time left until leaderboard is completed
            const left = generalGetLeaderboardTimeLeft(dataDatabase[0]);

            if(left > 0) {
                // Set leaderboard timeout and call leaderboard complete function after the left time
                generalLeaderboardTimeout = setTimeout(() => { generalLeaderboardComplete(io, dataDatabase[0]); }, left);
            } else {
                // Call leaderboard complete function if not time is left
                generalLeaderboardComplete(io, dataDatabase[0]);
            }
        } else if(dataDatabase[1] !== null) {
            // Update the new leaderboard and all users leaderboard points in database
            dataDatabase = await Promise.all([
                Leaderboard.findByIdAndUpdate(dataDatabase[1]._id, {
                    state: 'running',
                    updatedAt: new Date().getTime()
                }, { new: true }).select('duration state updatedAt').lean(),
                User.updateMany({}, { 'leaderboard.points': 0 }, {})
            ]);

            // Call leaderboard start function
            generalLeaderboardStart(io, dataDatabase[0]);
        }
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    generalGetLeaderboardDataSocket,
    generalLeaderboardStart,
    generalLeaderboardStop,
    generalLeaderboardInit
}