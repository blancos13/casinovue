// Load database models
const User = require('../../../database/models/User');
const Rain = require('../../../database/models/Rain');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetRainListData,
    adminCheckSendRainAmountData,
    adminCheckSendRainAmountRain
} = require('../../../utils/admin/rain');

const adminGetRainListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetRainListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get rains and rain count from database
        const dataDatabase = await Promise.all([
            Rain.countDocuments({
                type: { $regex: data.search, $options: 'i' }
            }),
            Rain.find({
                type: { $regex: data.search, $options: 'i' }
            }).sort({ createdAt: -1 }).limit(12).skip(offset)
            .select('amount participants creator type state createdAt')
            .populate({ path: 'participants.user', select: 'roblox.id username avatar balance' })
            .populate({ path: 'creator', select: 'roblox.id username avatar balance' }).lean()
        ]);

        callback({ success: true, count: dataDatabase[0], rains: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendRainAmountSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendRainAmountData(data);

        // Validate if rain is available
        let rainDatabase = await Rain.findOne({ type: 'site', $or: [{ state: 'created' }, { state: 'pending' }, { state: 'running' }] }).select('type state').lean();
        adminCheckSendRainAmountRain(rainDatabase);

        // Get new rain amount
        const amount = Math.floor(data.amount);

        // Update rain amount in database
        rainDatabase = await Rain.findByIdAndUpdate(rainDatabase._id, {
            amount: amount
        }, { new: true }).select('amount participants type state updatedAt').lean();

        // Send updated rain to frontend
        io.of('/general').emit('rain', { rain: rainDatabase });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetRainListSocket,
    adminSendRainAmountSocket
}