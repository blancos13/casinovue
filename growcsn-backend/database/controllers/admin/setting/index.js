// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingSetValue
} = require('../../../utils/setting');
const {
    adminCheckSendSettingValueData
} = require('../../../utils/admin/setting');

const adminSendSettingValueSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendSettingValueData(data);

        // Update settings in database
        const settings = await settingSetValue(data.setting, data.value);

        // Sent the updated settings to all connected users
        io.of('/general').emit('settings', { settings: settings });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminSendSettingValueSocket
}
