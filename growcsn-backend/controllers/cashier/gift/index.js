// Load database models
const User = require('../../../database/models/User');
const GiftCode = require('../../../database/models/GiftCode');
const GiftTransaction = require('../../../database/models/GiftTransaction');
const Report = require('../../../database/models/Report');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    captchaCheckData,
    captchaGetData
} = require('../../../utils/captcha');
const {
    cashierCheckSendGiftRedeemData,
    cashierCheckSendGiftRedeemCode
} = require('../../../utils/cashier/gift');

// Cashier gift variables
let cashierGiftRedeemBlock = [];

const cashierSendGiftRedeemSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendGiftRedeemData(data);

        // Validate captcha
        const captchaCheck = await captchaGetData(data.captcha);
        captchaCheckData(captchaCheck);

        // Validate gift code
        const codeDatabase = await GiftCode.findOne({ code: data.code }).select('code reward redeemer');
        cashierCheckSendGiftRedeemCode(codeDatabase, cashierGiftRedeemBlock);

        try {
            // Add gift code id to redeem block array
            cashierGiftRedeemBlock.push(codeDatabase._id.toString());

            // Get gift code reward in robux amount
            const amount = Math.floor((codeDatabase.reward / 3) * 1000);

            // Create promises array
            let promises = [];

            // Add update redeeming user, gift code, report and create gift transaction to promises array
            promises = [
                User.findByIdAndUpdate(user._id, {
                    $inc: {
                        balance: amount,
                        'stats.deposit': amount,
                        'limits.betToWithdraw': amount
                    },
                    updatedAt: new Date().getTime()
                }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
                GiftCode.findByIdAndUpdate(codeDatabase._id, {
                    redeemer: user._id,
                    updatedAt: new Date().getTime()
                }),
                GiftTransaction.create({
                    amount: amount,
                    data: {
                        transaction: codeDatabase.code
                    },
                    type: 'deposit',
                    user: user._id,
                    state: 'completed'
                }),
                Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                    $inc: {
                        'stats.total.deposit': codeDatabase.reward,
                        'stats.gift.deposit': codeDatabase.reward
                    }
                }, { upsert: true })
            ];

            // Add update users referrer query to promises array
            if(user.affiliates.referrer !== undefined) {
                promises.push(
                    User.findByIdAndUpdate(user.affiliates.referrer, {
                        $inc: { 
                            'affiliates.deposit': amount
                        },
                        updatedAt: new Date().getTime()
                    }, {})
                );
            }

            // Execute promises array queries
            const dataDatabase = await Promise.all(promises);

            // Send updated redeeming user to frontend
            io.of('/general').to(user._id.toString()).emit('user', { user: dataDatabase[0] });

            callback({ success: true });

            // Remove gift code id from redeem block array
            cashierGiftRedeemBlock.splice(cashierGiftRedeemBlock.indexOf(codeDatabase._id.toString()), 1);

            socketRemoveAntiSpam(user._id);
        } catch(err) {
            cashierGiftRedeemBlock.splice(cashierGiftRedeemBlock.indexOf(codeDatabase._id.toString()), 1);
            socketRemoveAntiSpam(socket.decoded._id);
            callback({ success: false, error: { type: 'error', message: err.message } });
        }
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    cashierSendGiftRedeemSocket
}
