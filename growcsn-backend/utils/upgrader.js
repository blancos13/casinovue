const upgraderCheckGetItemListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    } else if(data.sort === undefined || typeof data.sort !== 'string' || ['highest', 'lowest'].includes(data.sort) === false) {
        throw new Error('Your entered sort value is invalid.');
    }
}

const upgraderCheckSendBetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('Your entered bet amount is invalid.');
    } else if(data.amountPayout === undefined || isNaN(data.amountPayout) === true || Math.floor(data.amountPayout) <= 0) {
        throw new Error('Your entered bet payout amount is invalid.');
    } else if(data.mode === undefined || typeof data.mode !== 'string' || ['under', 'over'].includes(data.mode) === false) {
        throw new Error('Your entered bet multiplier is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.UPGRADER_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only bet a min amount of DL${parseFloat(process.env.UPGRADER_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    }
}

const upgraderCheckSendBetUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const upgraderCheckSendBetSeed = (seedDatabase) => {
    if(seedDatabase === null) {
        throw new Error('You need to generate a server seed first.');
    }
}

const upgraderCheckSendBetMultiplier = (multiplier) => {
    if(multiplier <= 100) {
        throw new Error('Your entered bet multiplier is to low.');
    }
}

module.exports = {
    upgraderCheckGetItemListData,
    upgraderCheckSendBetData,
    upgraderCheckSendBetUser,
    upgraderCheckSendBetSeed,
    upgraderCheckSendBetMultiplier
}