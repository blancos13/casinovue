const validator = require('validator');

const cashierCheckSendGiftRedeemData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your provided captcha token is invalid.');
    } else if(data.code === undefined || data.code === null || typeof data.code !== 'string' || data.code.trim() === '' || validator.isAlphanumeric(data.code, 'en-US') !== true) {
        throw new Error('Your provided gift code is invalid.');
    }
}

const cashierCheckSendGiftRedeemCode = (codeDatabase, cashierGiftRedeemBlock) => {
    if(codeDatabase === null || codeDatabase.redeemer !== undefined || cashierGiftRedeemBlock.includes(codeDatabase._id.toString()) === true) {
        throw new Error('Your provided gift code is not available.');
    }
}

module.exports = {
    cashierCheckSendGiftRedeemData,
    cashierCheckSendGiftRedeemCode
}
