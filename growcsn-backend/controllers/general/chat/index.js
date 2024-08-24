const mongoose = require('mongoose');
const validator = require('validator');

// Load database models
const FilterPhrase = require('../../../database/models/FilterPhrase');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    settingGet,
    settingSetValue
} = require('../../../utils/setting');
const {
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
    generalFilterMessage
} = require('../../../utils/general/chat');
const {
    generalUserGetLevel,
    generalUserGetRakeback
} = require('../../../utils/general/user');

// General chat variables
let generalChatMessages = {
    en: [],
    tr: [],
    de: [],
    es: [],
    beg: [],
    whale: []
};
let generalChatUserCooldowns = [];
let generalChatFilter = [];

const generalGetChatMessagesSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckGetChatMessagesData(data);

        // Leave current room if socket is in one
        const currentRoom = [...socket.rooms][1];
        if(currentRoom !== undefined) { socket.leave(currentRoom); }

        // Join the new chat room and update user online count
        socket.join(data.room);

        // Get chat room online count and send to frontend
        const onlineData = await generalGetChatOnlineCount(io);
        io.of('/general').emit('chatOnline', { online: onlineData });

        callback({ success: true, messages: generalChatMessages[data.room] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendChatMessageSocket = (io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendChatMessageData(data);

        // Get page settings
        const settings = settingGet();

        // Validate chat room
        let chatRoom = [...socket.rooms][1];
        generalCheckSendChatMessageRoom(user, settings, chatRoom);

        // Validate sending user
        generalCheckSendChatMessageUser(user, settings, generalChatUserCooldowns);

        // Add time to user cooldown array 
        generalChatUserCooldowns[user._id.toString()] = new Date().getTime();

        let message;
        if(user.rank === 'admin' && data.message.trim().startsWith('/system') === true) {
            // Create system message object
            message = {
                message: validator.escape(data.message.replace('/system', '').trim()),
                type: 'system'
            };
        } else {
            // Get user level
            const level = generalUserGetLevel(user);

            // Get user rakeback
            const rakeback = generalUserGetRakeback(user);

            // Create user message object
            message = {
                message: generalFilterMessage(data.message, generalChatFilter),
                room: chatRoom,
                user: {
                    _id: user._id,
                    roblox: user.roblox,
                    username: user.username,
                    avatar: user.avatar,
                    rank: user.rank,
                    level: level,
                    rakeback: rakeback.name,
                    stats: user.anonymous === true ? null : user.stats,
                    createdAt: user.createdAt
                },
                type: 'user'
            };
        }

        // Add message to specific chat room/s and send to frontend
        generalChatAddMessage(io, message);

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendChatRemoveSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendChatRemoveData(data);

        // Validate chat room
        let chatRoom = [...socket.rooms][1];
        generalCheckSendChatRemoveRoom(chatRoom);

        // Validate chat message
        generalCheckSendChatRemoveMessage(data, generalChatMessages[chatRoom]);

        // Remove message from chat messages array
        const index = generalChatMessages[chatRoom].findIndex((element) => element._id.toString() === data.messageId.toString());
        generalChatMessages[chatRoom].splice(index, 1);

        // Sent the removed message to the room connected users
        io.of('/general').to(chatRoom).emit('chatRemove', { messageId: data.messageId });

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendChatClearSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate chat room
        let chatRoom = [...socket.rooms][1];
        generalCheckSendChatClearRoom(chatRoom);

        // Clear chat room array
        generalChatMessages[chatRoom] = [];

        // Sent the removed message to the room connected users
        io.of('/general').to(chatRoom).emit('chatClear', {});

        // Create system message object
        message = {
            room: chatRoom,
            message: `Chat has been cleared by an administrator.`,
            type: 'system'
        };

        // Add message to specific chat room/s and send to frontend
        generalChatAddMessage(io, message);

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalSendChatLockSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        generalCheckSendChatLockData(data);

        // Get app settings
        let settings = settingGet();

        // Validate chat room
        let chatRoom = [...socket.rooms][1];
        generalCheckSendChatLockRoom(data, settings, chatRoom);

        // Update chat room setting in database
        settings = await settingSetValue(`chat.rooms.${chatRoom}.enabled`, data.value);

        // Sent the updated settings to all connected users
        io.of('/general').emit('settings', { settings: settings });

        // Create system message object
        message = {
            message: `Chat has been ${data.value === true ? 'unlocked' : 'locked'} by an administrator.`,
            room: chatRoom,
            type: 'system'
        };

        // Add message to specific chat room/s and send to frontend
        generalChatAddMessage(io, message);

        callback({ success: true });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const generalChatAddMessage = (io, message) => {
    try {
        // Create chat rooms array
        const rooms = message.type === 'user' || message.room !== undefined ? [message.room] : Object.keys(generalChatMessages);

        // Create message object
        message = {
           _id: new mongoose.Types.ObjectId(),
           ...message
        };

        for(const room of rooms) {
            // Remove oldest message specifc each room if there are more then 50 messages
            if(generalChatMessages[room].length > 50) { generalChatMessages[room].shift(); }

            // Add message to the specifc room array
            generalChatMessages[room].push(message);

            // Sent the message to frontend
            io.of('/general').to(room).emit('chatMessage', { message: message });
        }
    } catch(err) {
        console.error(err);
    }
}

const generalChatAddFilter = (phrase) => {
    // Add phrase to chat filter array
    generalChatFilter.push(phrase);
}

const generalChatRemoveFilter = (phrase) => {
    // Get phrase index and remove from chat filter array
    const index  = generalChatFilter.indexOf(phrase);
    if(index !== -1) { generalChatFilter.splice(index, 1); }
}

const generalChatInit = async(io) => {
    try {
        // Get filters phrases from database
        const filterDatabase = await FilterPhrase.find({}).select('phrase').lean();

        // Format filter phrases
        generalChatFilter = filterDatabase.map((element) => (element.phrase));

        // Get page settings
        const settings = settingGet();

        // Create system message object
        message = {
            message: 'Chat has been locked by an administrator.',
            type: 'system'
        };

        // Check if chat rooms are locked and if true add info message to room
        for(const room of Object.keys(generalChatMessages)) {
            if(settings.chat.rooms[room].enabled === false) {
                // Add chat room to message object
                message.room = room;

                // Add message to specific chat room/s and send to frontend
                generalChatAddMessage(io, message);
            }
        }
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    generalGetChatMessagesSocket,
    generalSendChatMessageSocket,
    generalSendChatRemoveSocket,
    generalSendChatClearSocket,
    generalSendChatLockSocket,
    generalChatAddMessage,
    generalChatAddFilter,
    generalChatRemoveFilter,
    generalChatInit
}
