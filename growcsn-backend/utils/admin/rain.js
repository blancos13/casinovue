const adminCheckGetRainListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    }
}

const adminCheckSendRainAmountData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || data.amount < 0) {
        throw new Error('Your entered rain amount value is invalid.');
    }
}

const adminCheckSendRainAmountRain = (rainDatabase) => {
    if(rainDatabase === null) {
        throw new Error('Your entered rain is not available.');
    } else if(rainDatabase.state !== 'created' && rainDatabase.state !== 'pending' && rainDatabase.state !== 'running') {
        throw new Error('Your entered rain is already completed');
    }
}

module.exports = {
    adminCheckGetRainListData,
    adminCheckSendRainAmountData,
    adminCheckSendRainAmountRain
}