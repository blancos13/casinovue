const validator = require('validator');

const unboxCheckGetBoxDataData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.boxId === undefined || data.boxId === null || typeof data.boxId !== 'string' || validator.isMongoId(data.boxId) !== true) {
        throw new Error('You’ve entered an invalid box id.');
    }
}

const unboxCheckGetBoxDataBox = (boxDatabase) => {
    if(boxDatabase === null || boxDatabase.state !== 'active') {
        throw new Error('Your entered box is not available.');
    }
}

const unboxCheckSendBetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.boxId === undefined || data.boxId === null || typeof data.boxId !== 'string' || validator.isMongoId(data.boxId) !== true) {
        throw new Error('You’ve entered an invalid box id.');
    } else if(data.unboxCount === undefined || data.unboxCount === null || isNaN(data.unboxCount) === true || Math.floor(data.unboxCount) < 1 || Math.floor(data.unboxCount) > 4) {
        throw new Error('You’ve entered an invalid unbox count.');
    }
}

const unboxCheckSendBetBox = (boxDatabase) => {
    if(boxDatabase === null || boxDatabase.state !== 'active') {
        throw new Error('Your requested box is not available.');
    }
}

const unboxCheckSendBetUser = (user, amountBetTotal) => {
    if(user.balance < amountBetTotal) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const unboxCheckSendBetSeed = (seedDatabase) => {
    if(seedDatabase === null) {
        throw new Error('You need to generate a server seed first.');
    }
}

const unboxGetOutcomeItem = (boxDatabase, outcome) => {
    let pos = 0;
    let outcomeItem = null;

    for(const item of boxDatabase.items) {
        pos = pos + item.tickets;
        if(outcome <= pos) { outcomeItem = item.item; break; }
    }

    return outcomeItem;
}

module.exports = {
    unboxCheckGetBoxDataData,
    unboxCheckGetBoxDataBox,
    unboxCheckSendBetData,
    unboxCheckSendBetBox,
    unboxCheckSendBetUser,
    unboxCheckSendBetSeed,
    unboxGetOutcomeItem
}