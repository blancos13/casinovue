// Load database models
const User = require('../../../database/models/User');
const FilterPhrase = require('../../../database/models/FilterPhrase');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetFilterListData,
    adminCheckSendFilterCreateData,
    adminCheckSendFilterCreateFilter,
    adminCheckSendFilterRemoveData,
    adminCheckSendFilterRemoveFilter
} = require('../../../utils/admin/filter');

// Load controllers
const {
    generalChatAddFilter,
    generalChatRemoveFilter
} = require('../../general/chat');

const adminGetFilterListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetFilterListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get filters and filters count from database
        const dataDatabase = await Promise.all([
            FilterPhrase.countDocuments({ phrase: { $regex: data.search, $options: 'i' } }),
            FilterPhrase.find({ phrase: { $regex: data.search, $options: 'i' } }).limit(12).skip(offset).select('phrase createdAt').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], filters: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendFilterCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendFilterCreateData(data);

        // Get filter phrase
        const phrase = data.phrase.toLowerCase();

        // Check if filter phrase already exists
        let filterDatabase = await FilterPhrase.findOne({ phrase: phrase }).select('phrase').lean();
        adminCheckSendFilterCreateFilter(filterDatabase);

        // Create new filter phrase in database
        filterDatabase = await FilterPhrase.create({ phrase: phrase });

        // Add phrase to chat filter array
        generalChatAddFilter(filterDatabase.phrase);

        callback({ success: true, filter: filterDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendFilterRemoveSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendFilterRemoveData(data);

        // Check if filter phrase exists
        let filterDatabase = await FilterPhrase.findById(data.filterId).select('phrase').lean();
        adminCheckSendFilterRemoveFilter(filterDatabase);

        // Remove filter phrase from database
        filterDatabase = await FilterPhrase.findByIdAndDelete(data.filterId);

        // Remove phrase from chat filter array
        generalChatRemoveFilter(filterDatabase.phrase);

        callback({ success: true, filter: filterDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetFilterListSocket,
    adminSendFilterCreateSocket,
    adminSendFilterRemoveSocket
}
