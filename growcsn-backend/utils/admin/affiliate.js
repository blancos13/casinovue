const validator = require('validator');

const adminCheckGetAffiliateListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    } else if(data.sort === undefined || data.sort === null || typeof data.sort !== 'string' || ['newest', 'oldest', 'balance', 'rank'].includes(data.sort) === false) {
        throw new Error('Your entered sort value is invalid.');
    }
}

const adminCheckSendAffiliateBlockData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.userId === undefined || data.userId === null || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your entered user id is invalid.');
    } else if(data.block === undefined || data.block === null || typeof data.block !== 'boolean') {
        throw new Error('Your entered affiliate block value is invalid.');
    }
}

const adminCheckSendAffiliateClearData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.userId === undefined || data.userId === null || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your entered user id is invalid.');
    }
}

const adminCheckSendAffiliateCodeData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.userId === undefined || data.userId === null || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your entered user id is invalid.');
    } else if(data.code === undefined || data.code !== null && (typeof data.code !== 'string' || data.code.trim() === '' || data.code.length <= 3 || data.code.length > 20 || validator.isAlphanumeric(data.code, 'en-US', { ignore: '-_' }) !== true)) {
        throw new Error('Your entered affiliate code is invalid.');
    }
}

const adminCheckSendAffiliateCodeCode = (codeDatabase) => {
    if(codeDatabase !== null) {
        throw new Error('Your entered affiliate code is already used by a other user.');
    }
}

const adminCheckSendAffiliateAvailableData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.userId === undefined || data.userId === null || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your entered user id is invalid.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || Math.floor(data.amount) < 0) {
        throw new Error('Your entered available amount is invalid.');
    }
}

const adminFormatAffiliateSort = (value) => {
    let sort = { createdAt: -1 };

    if(value === 'oldest') {
        sort = { createdAt: 1 };
    } else if(value === 'balance') {
        sort = { balance: 1 };
    } else if(value === 'rank') {
        sort = { rank: 1 };
    }

    return sort;
}

module.exports = {
    adminCheckGetAffiliateListData,
    adminCheckSendAffiliateBlockData,
    adminCheckSendAffiliateClearData,
    adminCheckSendAffiliateCodeData,
    adminCheckSendAffiliateCodeCode,
    adminCheckSendAffiliateAvailableData,
    adminFormatAffiliateSort
}
