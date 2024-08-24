// Load database models
const User = require('../../../database/models/User');
const BalanceTransaction = require('../../../database/models/BalanceTransaction');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    captchaCheckData,
    captchaGetData
} = require('../../../utils/captcha');
const {
    generalUserGetFormated
} = require('../../../utils/general/user');
const {
    generalCheckSendAffiliateCodeData,
    generalCheckSendAffiliateCodeCode,
    generalCheckSendAffiliateClaimCodeData,
    generalCheckSendAffiliateClaimCodeUser,
    generalCheckSendAffiliateClaimCodeCode,
    generalCheckSendAffiliateClaimEarningsUser
} = require('../../../utils/general/affiliate');

const generalGetAffiliateDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get referred users from database
        let referredDatabase = await User.find({ 
            'affiliates.referrer': user._id 
        }).sort({ 'affiliates.generated': -1 }).limit(10).select('roblox.id username avatar rank xp affiliates.generated affiliates.referrer anonymous createdAt').lean();

        // Format referred users
        referredDatabase = referredDatabase.map((element) => ({ user: generalUserGetFormated(element), affiliates: element.affiliates }));

        callback({ success: true, data: user.affiliates, referred: referredDatabase });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendAffiliateCodeSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendAffiliateCodeData(data);

        // Get affiliate code and transform to lower case
        const code = data.code.toLowerCase();

        // Validate if affiliate already code exists
        let dataDatabase = await User.findOne({ 'affiliates.code': code }).select('affiliates.code').lean();
        generalCheckSendAffiliateCodeCode(dataDatabase);

        // Update user in database
        dataDatabase = await User.findByIdAndUpdate(user._id, { 'affiliates.code': code }, { new: true }).select('affiliates').lean();

        callback({ success: true, data: dataDatabase.affiliates });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendAffiliateClaimCodeSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendAffiliateClaimCodeData(data);

        // Validate captcha
        const captchaCheck = await captchaGetData(data.captcha);
        captchaCheckData(captchaCheck);

        // Get user ip address
        const userIp = socket.handshake.headers['cf-connecting-ip'] || socket.conn.remoteAddress;

        // Get affiliate code and transform to lower case
        const code = data.code.toLowerCase();

        // Get user with same ip and affiliate code from database
        let dataDatabase = await Promise.all([
            User.findOne({ 'affiliates.referredAddress': userIp }).select('affiliates').lean(),
            User.findOne({ 'affiliates.code': code }).select('affiliates').lean()
        ]);

        // Validate if user has not already redeemed a affiliate code
        generalCheckSendAffiliateClaimCodeUser(user, dataDatabase[0]);

        // Validate if affiliate code exists and is not the from the same user
        generalCheckSendAffiliateClaimCodeCode(user, dataDatabase[1]);

        // Update redeeming, referring user and create balance transaction in database
        dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: 10000
                },
                'affiliates.referrer': dataDatabase[1]._id,
                'affiliates.referredAddress': userIp,
                'affiliates.referredAt': new Date().getTime(),
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            User.findByIdAndUpdate(dataDatabase[1]._id, {
                $inc: {
                    'affiliates.referred': 1
                }
            }),
            BalanceTransaction.create({
                amount: 10000,
                type: 'affiliateCodeClaim',
                user: user._id,
                state: 'completed'
             })
        ]);

        callback({ success: true, user: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendAffiliateClaimEarningsSocket = async(io, socket, user, data, callback) => {
    try {
        // Check if user has enough available affiliate earnings
        generalCheckSendAffiliateClaimEarningsUser(user);

        // Update claiming user and create balance transaction in database
        const dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: user.affiliates.available
                },
                'affiliates.available': 0,
                updatedAt: new Date().getTime()
            }, { new: true }).select('balance xp stats rakeback affiliates mute ban verifiedAt updatedAt'),
            BalanceTransaction.create({
                amount: user.affiliates.available,
                type: 'affiliateEarningClaim',
                user: user._id,
                state: 'completed'
            })
        ]);

        callback({ success: true, user: dataDatabase[0] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    generalGetAffiliateDataSocket,
    generalSendAffiliateCodeSocket,
    generalSendAffiliateClaimCodeSocket,
    generalSendAffiliateClaimEarningsSocket
}
