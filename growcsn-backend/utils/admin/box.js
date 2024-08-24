const validator = require('validator');
const base64Img = require('base64-img');

const adminCheckGetBoxListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    }
}

const adminCheckSendBoxCreateData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.name === undefined || data.name === null || typeof data.name !== 'string' || data.name.trim() === '') {
        throw new Error('Your entered name is invalid.');
    } else if(data.image === undefined || data.image === null || typeof data.image !== 'string') {
        throw new Error('Your entered image is invalid.');
    } else if(data.categories === undefined || data.categories === null || Array.isArray(data.categories) !== true || data.categories.some((element) => ['featured', 'low risk', '50/50', 'high risk', 'partners'].includes(element) !== true) === true) {
        throw new Error('Your entered categories are invalid.');
    } else if(data.items === undefined || data.items === null || Array.isArray(data.items) !== true || data.items.length <= 0) {
        throw new Error('Your entered items are invalid.');
    }
}

const adminCheckSendBoxCreateItems = (data, itemsDatabase) => {
    for(const item of data.items) {
        if(item.item === undefined || item.item === null || typeof item.item !== 'string' || validator.isMongoId(item.item) !== true) {
            throw new Error('Your entered item id is invalid.');
        } else if(item.tickets === undefined || item.tickets === null || isNaN(item.tickets) === true) {
            throw new Error('Your entered item tickets is invalid.');
        } else if(itemsDatabase.some((element) => element._id.toString() === item.item.toString()) !== true) {
            throw new Error('Your entered item is invalid.');
        }
    }
} 

const adminCheckSendBoxRemoveData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.boxId === undefined || data.boxId === null || typeof data.boxId !== 'string' || validator.isMongoId(data.boxId) !== true) {
        throw new Error('Your entered box id is invalid.');
    }
}

const adminCheckSendBoxRemoveBox = (boxDatabase) => {
    if(boxDatabase === null) {
        throw new Error('Your entered box was not found.');
    } else if(boxDatabase.state !== 'created') {
        throw new Error('Your entered box is still active.');
    }
}

const adminSaveImage = (image, name) => {
    return new Promise(async(resolve, reject) => {
        try {
            base64Img.img(image, './public/img', name, function(err, path) {
                if(err) { throw Error(err.message); } 
                resolve();
            });
        } catch(err) {
            reject(err);
        }
    });
}

const adminGetAmountBox = (data, itemsDatabase) => {
    let amount = 0;

    for(const item of data.items) {
        const index = itemsDatabase.findIndex((element) => element._id.toString() === item.item.toString());
        if(index !== -1) { amount = amount + Math.floor(itemsDatabase[index].amountFixed * (item.tickets / 100000) * 1.15); }
    }

    return amount;
}

module.exports = {
    adminCheckGetBoxListData,
    adminCheckSendBoxCreateData,
    adminCheckSendBoxCreateItems,
    adminCheckSendBoxRemoveData,
    adminCheckSendBoxRemoveBox,
    adminSaveImage,
    adminGetAmountBox
}