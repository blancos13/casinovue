const validator = require('validator');

const adminCheckSendSettingValueData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.setting === undefined || data.setting === null || typeof data.setting !== 'string' || data.setting.length >= 100 || validator.isAlphanumeric(data.setting, 'en-US', { ignore: '.' }) !== true) {
        throw new Error('Your entered setting is invalid.');
    } else if(data.value === undefined || data.value === null || (['chat.mode', 'general.reward.multiplier'].includes(data.setting) !== true && typeof data.value !== 'boolean') || (data.setting === 'general.reward.multiplier' && typeof data.value !== 'string') || (data.setting === 'chat.mode' && typeof data.value !== 'string')) {
        throw new Error('Your entered value is invalid.');
    }
}

module.exports = {
    adminCheckSendSettingValueData
}
