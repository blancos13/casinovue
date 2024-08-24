// Load database models
const User = require('../../../database/models/User');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetAffiliateListData,
    adminCheckSendAffiliateBlockData,
    adminCheckSendAffiliateClearData,
    adminCheckSendAffiliateCodeData,
    adminCheckSendAffiliateCodeCode,
    adminCheckSendAffiliateAvailableData,
    adminFormatAffiliateSort
} = require('../../../utils/admin/affiliate');

const adminGetAffiliateListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetAffiliateListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get database sort query
        const sort = adminFormatAffiliateSort(data.sort);

        // Get users and users count from database
        const dataDatabase = await Promise.all([
            User.countDocuments({
                'affiliates.code': { $exists: true, $ne: null },
                $or: [
                    { 'roblox.id': { $regex: data.search, $options: 'i' } },
                    { username: { $regex: data.search, $options: 'i' } },
                    { 'affiliates.code': { $regex: data.search, $options: 'i' } }
                ]
            }),
            User.find({
                'affiliates.code': { $exists: true, $ne: null },
                $or: [
                    { 'roblox.id': { $regex: data.search, $options: 'i' } },
                    { username: { $regex: data.search, $options: 'i' } },
                    { 'affiliates.code': { $regex: data.search, $options: 'i' } }
                ]
            }).sort(sort).limit(12).skip(offset).select('roblox.id username avatar balance rank xp stats limits.blockAffiliate affiliates createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], affiliates: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendAffiliateBlockSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendAffiliateBlockData(data);

        // Update affiliate block in database
        const affiliateDatabase = await User.findByIdAndUpdate(data.userId, {
            'limits.blockAffiliate': data.block
        }, { new: true }).select('roblox.id username avatar balance rank xp stats limits.blockAffiliate affiliates createdAt').lean();

        callback({ success: true, affiliate: affiliateDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendAffiliateClearSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendAffiliateClearData(data);

        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(data.userId, {
                'affiliates.referred': 0,
                'affiliates.deposited': 0,
                'affiliates.earned': 0,
                'affiliates.available': 0
            }, { new: true }).select('roblox.id username avatar balance rank xp stats limits.blockAffiliate affiliates createdAt').lean(),
            User.updateMany({ 'affiliates.referrer': data.userId }, {
                $unset: { 'affiliates.referrer': 1 }
            }, {})
        ]);

        callback({ success: true, affiliate: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendAffiliateCodeSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendAffiliateCodeData(data);

        let query = { $unset: { 'affiliates.code': 1 } };
        if(data.code !== null) {
            // Get affiliate code from database if exists
            const codeDatabase = await User.findOne({ 'affiliates.code': data.code }).select('affiliates').lean();

            // Validate if affiliate code already exists
            adminCheckSendAffiliateCodeCode(codeDatabase);

            // Set code update uqery variable
            query = { 'affiliates.code': data.code };
        }

        // Update affiliate code in database
        const affiliateDatabase = await User.findByIdAndUpdate(data.userId, query, { new: true }).select('roblox.id username avatar balance rank xp stats limits.blockAffiliate affiliates createdAt').lean();

        callback({ success: true, affiliate: affiliateDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendAffiliateAvailableSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendAffiliateAvailableData(data);

        // Update affiliate available in database
        const affiliateDatabase = await User.findByIdAndUpdate(data.userId, {
            'affiliates.available': data.amount
        }, { new: true }).select('roblox.id username avatar balance rank xp stats limits.blockAffiliate affiliates createdAt').lean();

        callback({ success: true, affiliate: affiliateDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetAffiliateListSocket,
    adminSendAffiliateBlockSocket,
    adminSendAffiliateClearSocket,
    adminSendAffiliateCodeSocket,
    adminSendAffiliateAvailableSocket
}
