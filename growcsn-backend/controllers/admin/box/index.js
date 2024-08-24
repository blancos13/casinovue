const slugify = require('slugify');

// Load database models
const Box = require('../../../database/models/Box');
const LimitedItem = require('../../../database/models/LimitedItem');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    adminCheckGetBoxListData,
    adminCheckSendBoxCreateData,
    adminCheckSendBoxCreateItems,
    adminCheckSendBoxRemoveData,
    adminCheckSendBoxRemoveBox,
    adminSaveImage,
    adminGetAmountBox
} = require('../../../utils/admin/box');

const adminGetBoxListSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckGetBoxListData(data);

        // Calculating database query offset
        const offset = (data.page - 1) * 12;

        // Get boxes, boxes count and box items from database
        const dataDatabase = await Promise.all([
            Box.countDocuments({
                name: { $regex: data.search, $options: 'i' }
            }),
            Box.find({
                name: { $regex: data.search, $options: 'i' }
            }).sort({ createdAt: -1 }).limit(12).skip(offset).select('name amount items categories state createdAt').lean(),
            LimitedItem.find({}).select('name image amountFixed').lean()
        ]);

        callback({ success: true, count: dataDatabase[0], boxes: dataDatabase[1], items: dataDatabase[2] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendBoxCreateSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendBoxCreateData(data);

        // Get box items from database
        const itemsDatabase = await LimitedItem.find({}).select('amountFixed').lean();

        // Validate sent items
        adminCheckSendBoxCreateItems(data, itemsDatabase);

        // Get box amount
        const amountBox = adminGetAmountBox(data, itemsDatabase);

        // Get name slug
        const slug = slugify(data.name, { lower: true });

        // Save box image
        await adminSaveImage(data.image, slug);

        // Create box in database
        let boxDatabase = await Box.create({
            name: data.name,
            slug: slug,
            amount: amountBox,
            items: data.items,
            categories: data.categories,
            type: 'site',
            state: 'active'
        });

        // Convert box object to javascript object
        boxDatabase = boxDatabase.toObject();

        callback({ success: true, box: boxDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const adminSendBoxRemoveSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        adminCheckSendBoxRemoveData(data);

        // Validate if the box is in database and not active
        let boxDatabase = Box.findById(data.leaderboardId).select('state').lean();
        adminCheckSendBoxRemoveBox(dataDatabase[0]);

        // Remove leaderboard from database
        boxDatabase = await Box.findByIdAndDelete(data.boxId);

        callback({ success: true, box: boxDatabase });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(user._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

module.exports = {
    adminGetBoxListSocket,
    adminSendBoxCreateSocket,
    adminSendBoxRemoveSocket
}