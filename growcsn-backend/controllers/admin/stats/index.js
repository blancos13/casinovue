// Load database models
const Report = require('../../../database/models/Report');

// Load utils
const {
    adminCheckGetStatsListData,
    adminFormatStats
} = require('../../../utils/admin/stats');

const adminGetStatsDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get all stats from database
        const statsDatabase = await Report.find({}).sort({ createdAt: -1 }).limit(420).select('stats.total createdAt').lean();

        // Format total, monthly, weekly and daily stats
        const stats = adminFormatStats(statsDatabase);

        callback({ success: true, stats: stats, list: statsDatabase });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminGetStatsListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetStatsListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get stats and stats count from database
        const dataDatabase = await Promise.all([
            Report.countDocuments({}),
            Report.find({}).limit(12).skip(offset).sort({ createdAt: -1 }).select('stats createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], stats: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetStatsDataSocket,
    adminGetStatsListSocket
}
