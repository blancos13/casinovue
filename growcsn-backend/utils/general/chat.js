const validator = require('validator');

const generalCheckGetChatMessagesData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.room === undefined || data.room === null || typeof data.room !== 'string' || ['en', 'tr', 'de', 'es', 'beg', 'whale'].includes(data.room) === false) {
        throw new Error('Your entered chat room is invalid.');
    }
}

const generalCheckSendChatMessageData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.message === undefined || data.message === null || typeof data.message !== 'string' || data.message.trim() === '') {
        throw new Error('Your entered chat message is invalid.');
    } else if(data.message.length > 300) {
        throw new Error('Your entered chat message is to long.');
    }
}

const generalCheckSendChatMessageRoom = (user, settings, chatRoom) => {
    if(chatRoom === undefined || chatRoom === null) {
        throw new Error('Your entered chat room is invalid.');
    } else if(['admin', 'mod'].includes(user.rank) === false && settings.chat.rooms[chatRoom].enabled !== true) {
        throw new Error('Your entered chat room is currently locked.');
    } else if(chatRoom === 'whale' && user.stats.bet < (1000000 * 1000)) {
        throw new Error('Your need to have a minimum wager of 1,000,000 to use the whale chat.');
    }
}

const generalCheckSendChatMessageUser = (user, settings, chatUserCooldowns) => {
    if(user === undefined || settings === undefined || chatUserCooldowns === undefined) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(0 >= Math.floor(Math.pow(user.xp / 1000 / 100, 1 / 3))) {
        throw new Error('You need to have a minimum level of 1 to use the chat.');
    } else if(user.mute !== undefined && user.mute.expire !== undefined && new Date(user.mute.expire).getTime() > Date.now()) {
        throw new Error(`You are still muted for another ${generalChatGetMuteTime(user.mute.expire)}.`);
    } else if(settings.chat.mode === 'normal' && user.rank === 'user' && chatUserCooldowns[user._id.toString()] !== undefined && chatUserCooldowns[user._id.toString()] > Math.floor(new Date().getTime() - 3000)) {
        throw new Error(`You can only send 1 message every 3 seconds.`);
    } else if(settings.chat.mode === 'slow' && user.rank === 'user' && chatUserCooldowns[user._id.toString()] !== undefined && chatUserCooldowns[user._id.toString()] > Math.floor(new Date().getTime() - 6000)) {
        throw new Error(`You can only send 1 message every 6 seconds because the chat is in slow mode.`);
    }
}

const generalCheckSendChatRemoveData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.messageId === undefined || data.messageId === null || typeof data.messageId !== 'string' || validator.isMongoId(data.messageId) !== true) {
        throw new Error('Your entered chat message is invalid.');
    }
}

const generalCheckSendChatRemoveRoom = (chatRoom) => {
    if(chatRoom === undefined || chatRoom === null) {
        throw new Error('Your entered chat room is invalid.');
    }
}

const generalCheckSendChatRemoveMessage = (data, chatMessages) => {
    if(chatMessages.some((element) => element._id.toString() === data.messageId.toString()) !== true) {
        throw new Error('Your entered chat message is not available.');
    }
}

const generalCheckSendChatClearRoom = (chatRoom) => {
    if(chatRoom === undefined || chatRoom === null) {
        throw new Error('Your entered chat room is invalid.');
    }
}

const generalCheckSendChatLockData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.value === undefined || data.value === null || typeof data.value !== 'boolean') {
        throw new Error('Your entered chat lock value is invalid.');
    }
}

const generalCheckSendChatLockRoom = (data, settings, chatRoom) => {
    if(chatRoom === undefined || chatRoom === null) {
        throw new Error('Your entered chat room is invalid.');
    } else if(data.value === settings.chat.rooms[chatRoom].enabled) {
        throw new Error(`Your entered chat room is already ${data.value === true ? 'unlocked' : 'locked'}.`);
    }
}

const generalGetChatOnlineCount = (io) => {
    return new Promise(async(resolve, reject) => {
        try {
            const onlineData = await Promise.all([
                io.of('/general').in('en').allSockets(),
                io.of('/general').in('tr').allSockets(),
                io.of('/general').in('de').allSockets(),
                io.of('/general').in('es').allSockets(),
                io.of('/general').in('beg').allSockets(),
                io.of('/general').in('whale').allSockets()
            ]);

            resolve({ 
                en: Math.floor(onlineData[0].size * 1.6), 
                tr: Math.floor(onlineData[1].size * 1.6), 
                de: Math.floor(onlineData[2].size * 1.6), 
                es: Math.floor(onlineData[3].size * 1.6), 
                beg: Math.floor(onlineData[4].size * 1.6), 
                whale: Math.floor(onlineData[5].size * 1.6) 
            });
        } catch(err) {
            resolve({ en: 0, tr: 0, de: 0, es: 0, beg: 0, whale: 0 });
        }
    });
}

const generalChatGetMuteTime = (muteExpire) => {
    const timeLeft = Math.floor((new Date(muteExpire).getTime() - new Date().getTime()) / 1000);

    if(timeLeft > 60) { return `${Math.floor(timeLeft / 60)} minutes` }
    else { return `${timeLeft} seconds`; }
}

const generalFilterMessage = (message, generalChatFilter) => {
    let escaped = validator.escape(message);

    for(let phrase of generalChatFilter) {
        let lower = escaped.toLowerCase();

        while(lower.includes(phrase) === true) {
            const pos = lower.indexOf(phrase);

            lower = lower.substring(0, pos) + '*'.repeat(phrase.length) + lower.substring(pos + phrase.length);
            escaped = escaped.substring(0, pos) + '*'.repeat(phrase.length) + escaped.substring(pos + phrase.length);
        }
    }

    return escaped;
}

module.exports = {
    generalCheckGetChatMessagesData,
    generalCheckSendChatMessageData,
    generalCheckSendChatMessageRoom,
    generalCheckSendChatMessageUser,
    generalCheckSendChatRemoveData,
    generalCheckSendChatRemoveRoom,
    generalCheckSendChatRemoveMessage,
    generalCheckSendChatClearRoom,
    generalCheckSendChatLockData,
    generalCheckSendChatLockRoom,
    generalGetChatOnlineCount,
    generalChatGetMuteTime,
    generalFilterMessage
}
