// Load database models
const User = require('../../../database/models/User');
const PromoCode = require('../../../database/models/PromoCode');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetPromoListData,
    adminCheckSendPromoCreateData,
    adminCheckSendPromoCreateCode,
    adminCheckSendPromoRemoveData,
    adminCheckSendPromoRemoveCode
} = require('../../../utils/admin/promo');

const adminGetPromoListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetPromoListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get promos and users count from database
        const dataDatabase = await Promise.all([
            PromoCode.countDocuments({
                code: { $regex: data.search, $options: 'i' }
            }),
            PromoCode.find({
                code: { $regex: data.search, $options: 'i' }
            }).limit(12).skip(offset).select('code reward redeemptionsTotal redeemptionsMax createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], promos: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendPromoCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendPromoCreateData(data);

        // Get code, reward, max redeemptions and min level
        const code = data.code.toLowerCase();
        const reward = Math.floor(data.reward);
        const redeemptions = Math.floor(data.redeemptions);
        const level = Math.floor(data.level);

        // Validate if a promo code with the same name is already in database
        let promoDatabase = await PromoCode.findOne({ code: code }).select('code').lean();
        adminCheckSendPromoCreateCode(promoDatabase);

        // Create promo code in database
        promoDatabase = await PromoCode.create({
            code: code,
            reward: reward,
            levelMin: level,
            redeemptionsMax: redeemptions
        });

        // Convert promo code object to javascript object
        promoDatabase = promoDatabase.toObject();

        callback({ success: true, promo: promoDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendPromoRemoveSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendPromoRemoveData(data);

        // Validate if the promo code is in database
        let promoDatabase = await PromoCode.findById(data.promoId).select('_id').lean();
        adminCheckSendPromoRemoveCode(promoDatabase);

        // Remove promo code from database
        await PromoCode.findByIdAndDelete(data.promoId);

        callback({ success: true, promo: promoDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetPromoListSocket,
    adminSendPromoCreateSocket,
    adminSendPromoRemoveSocket
}
