const validator = require('validator');

const adminCheckGetFilterListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    }
}

const adminCheckSendFilterCreateData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.phrase === undefined || data.phrase === null || typeof data.phrase !== 'string' || data.phrase.trim() === '') {
        throw new Error('Your entered filter phrase is invalid.');
    }
}

const adminCheckSendFilterCreateFilter = (filterDatabase) => {
    if(filterDatabase !== null) {
        throw new Error('Your entered filter prase is already existing.');
    }
}

const adminCheckSendFilterRemoveData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.filterId === undefined || data.filterId === null || typeof data.filterId !== 'string' || validator.isMongoId(data.filterId) !== true) {
        throw new Error('Your entered filter id is invalid.');
    }
}

const adminCheckSendFilterRemoveFilter = (filterDatabase) => {
    if(filterDatabase === null) {
        throw new Error('Your entered filter id is not available.');
    }
}

module.exports = {
    adminCheckGetFilterListData,
    adminCheckSendFilterCreateData,
    adminCheckSendFilterCreateFilter,
    adminCheckSendFilterRemoveData,
    adminCheckSendFilterRemoveFilter
}
