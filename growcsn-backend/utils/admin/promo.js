const validator = require('validator');

const adminCheckGetPromoListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    }
}

const adminCheckSendPromoCreateData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.code === undefined || data.code === null || typeof data.code !== 'string' || data.code.trim() === '' || validator.isAlphanumeric(data.code, 'en-US', { ignore: ' -#$' }) !== true) {
        throw new Error('Your entered code is invalid.');
    } else if(data.reward === undefined || data.reward === null || isNaN(data.reward) === true || Math.floor(data.reward) < 10) {
        throw new Error('Your entered code reward is invalid.');
    } else if(data.redeemptions === undefined || data.redeemptions === null || isNaN(data.redeemptions) === true || Math.floor(data.redeemptions) <= 0) {
        throw new Error('Your entered code redeemptions is invalid.');
    } else if(data.level === undefined || data.level === null || isNaN(data.level) === true || Math.floor(data.level) < 0 || Math.floor(data.level) > 100) {
        throw new Error('Your entered min level is invalid.');
    }
}

const adminCheckSendPromoCreateCode = (promoDatabase) => {
    if(promoDatabase !== null) {
        throw new Error('Your entered code is already existing.');
    }
}

const adminCheckSendPromoRemoveData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.promoId === undefined || data.promoId === null || typeof data.promoId !== 'string' || validator.isMongoId(data.promoId) !== true) {
        throw new Error('Your entered promo id is invalid.');
    }
}

const adminCheckSendPromoRemoveCode = (promoDatabase) => {
    if(promoDatabase === null) {
        throw new Error('Your entered code is not existing.');
    }
}

module.exports = {
    adminCheckGetPromoListData,
    adminCheckSendPromoCreateData,
    adminCheckSendPromoCreateCode,
    adminCheckSendPromoRemoveData,
    adminCheckSendPromoRemoveCode
}
