// Load database models
const User = require('../../../database/models/User');
const PromoCode = require('../../../database/models/PromoCode');
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
    generalCheckSendPromoClaimData,
    generalCheckSendPromoClaimCode
} = require('../../../utils/general/promo');

// General promo variables
let generalPromoClaimBlock = [];

const generalSendPromoClaimSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendPromoClaimData(data);

        // Validate captcha
        const captchaCheck = await captchaGetData(data.captcha);
        captchaCheckData(captchaCheck);

        // Validate the promo code
        const promoDatabase = await PromoCode.findOne({ code: data.code.toLowerCase() }).select('code reward levelMin redeemers redeemptionsTotal redeemptionsMax').lean();
        generalCheckSendPromoClaimCode(user, promoDatabase, generalPromoClaimBlock);

        try {
            // Add promo code id to claim block array
            generalPromoClaimBlock.push(promoDatabase._id.toString());

            // Update claiming user, promo code and create balance transaction in database
            const dataDatabase = await Promise.all([
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: promoDatabase.reward,
                        'limits.betToWithdraw': Math.floor(promoDatabase.reward / 2)
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                PromoCode.findByIdAndUpdate(promoDatabase._id, {
                    $push: {
                        redeemers: {
                            user: user._id
                        }
                    },
                    $inc: {
                        redeemptionsTotal: 1
                    },
                    updatedAt: new Date().getTime()
                }),
                BalanceTransaction.create({
                    amount: promoDatabase.reward,
                    type: 'promoCodeClaim',
                    user: user._id,
                    state: 'completed'
                })
            ]);

            // Sent updated redeeming user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            callback({ success: true });

            // Remove promo code id from claim block array
            generalPromoClaimBlock.splice(generalPromoClaimBlock.indexOf(promoDatabase._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            generalPromoClaimBlock.splice(generalPromoClaimBlock.indexOf(promoDatabase._id.toString()), 1);
            socketRemoveAntiSpam(socket.decoded._id);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    generalSendPromoClaimSocket
}
