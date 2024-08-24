const validator = require('validator');

const generalCheckSendPromoClaimData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your entered captcha token is invalid.');
    } else if(data.code === undefined || data.code === null || typeof data.code !== 'string' || validator.isAlphanumeric(data.code, 'en-US', { ignore: ' -#$' }) !== true) {
        throw new Error('Your entered promo code is invalid.');
    }
}

const generalCheckSendPromoClaimCode = (user, promoDatabase, generalPromoClaimBlock) => {
    if(promoDatabase === null) {
        throw new Error('Your entered promo code is not available.');
    } else if(promoDatabase.redeemptionsTotal >= promoDatabase.redeemptionsMax || generalPromoClaimBlock.filter((element) => element === promoDatabase._id.toString()) >= (promoDatabase.redeemptionsMax - promoDatabase.redeemptionsTotal)) {
        throw new Error('Your entered promo code is not available.');
    } else if(promoDatabase.levelMin > Math.floor(Math.pow(user.xp / 1000 / 100, 1 / 3))) {
        throw new Error(`Your need to have a minimum level of ${promoDatabase.levelMin} to use this promo code.`);
    } else if(promoDatabase.redeemers.some((element) => element.user.toString() === user._id.toString()) === true) {
        throw new Error('Your have already claimed this promo code.');
    }
}

module.exports = {
    generalCheckSendPromoClaimData,
    generalCheckSendPromoClaimCode
}
