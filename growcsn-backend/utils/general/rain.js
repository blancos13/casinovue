const generalCheckSendRainCreateData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('Your entered rain amount is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.RAIN_MIN_HOST_AMOUNT * 1000)) {
        throw new Error(`You can only host a rain with a minmum amount of $${parseFloat(process.env.RAIN_MIN_HOST_AMOUNT).toFixed(2)}.`);
    }
}

const generalCheckSendRainCreateRain = (checkRain, generalRainCreateBlock) => {
    if(checkRain !== null) {
        throw new Error('You need to wait for the current hosted rain to complete.');
    } else if(generalRainCreateBlock.length !== 0) {
        throw new Error('You need to wait for the current hosted rain to complete.');
    }
}

const generalCheckSendRainCreateUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    } if(user.limits.blockSponsor === true) {
        throw new Error('You aren\'t allowed to create a rain at the moment.');
    }
}

const generalCheckSendRainTipData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('Your entered tip amount is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.RAIN_MIN_TIP_AMOUNT * 1000)) {
        throw new Error(`You can only tip a minmum amount of $${parseFloat(process.env.RAIN_MIN_TIP_AMOUNT).toFixed(2)} to the rain.`);
    }
}

const generalCheckSendRainTipRain = (rainDatabase) => {
    if(rainDatabase === null) {
        throw new Error('Your entered rain is not available.');
    } else if(rainDatabase.state !== 'created' && rainDatabase.state !== 'pending' && rainDatabase.state !== 'running') {
        throw new Error('Your entered rain is already completed');
    }
}

const generalCheckSendRainTipUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    } else if(user.limits.blockSponsor === true) {
        throw new Error('You aren\'t allowed to tip the rain at the moment.');
    }
}

const generalCheckSendRainJoinData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your provided captcha token is invalid.');
    }
}

const generalCheckSendRainJoinRain = (user, rainDatabase, settings) => {
    if(rainDatabase === null) {
        throw new Error('Your entered rain is not available.');
    } else if(new Date(rainDatabase.updatedAt).getTime() + (1000 * 60 * 2) <= new Date().getTime()) {
        throw new Error('Your entered rain is already completed');
    } else if(rainDatabase.participants.some((element) => element.user.toString() === user._id.toString()) === true) {
        throw new Error('You can only join the rain once.');
    } else if(rainDatabase.type === 'site' && settings.general.rain.enabled !== true) {
        throw new Error('The rain is currently unavailable at this time.');
    }
}

const generalCheckSendRainJoinUser = (user, rainDatabase, rainsDatabase) => {
    if(user.limits.blockRain === true) {
        throw new Error('You aren\'t allowed to join the rain at the moment.');
    } else if(user.limits.betToRain >= 10) {
        throw new Error(`You need to wager ${ parseFloat(Math.floor(user.limits.betToWithdraw / 10) / 100).toFixed(2) } more before you can join the rain.`);
    } else if(rainDatabase.type === 'site' && 5 > Math.floor(Math.pow(user.xp / 1000 / 100, 1 / 3))) {
        throw new Error('You need to have a minimum level of 5 to join the rain.');
    } else if(rainDatabase.type === 'site' && rainsDatabase.filter((element) => element.type === 'site').length >= 12) {
        throw new Error('You aren\'t allowed to join the rain more then 12 times per 24 hours.');
    }
}

const generalCheckSendRainJoinTransactions = (transactionsDatabase) => {
    let amountDeposit = 0;

    for(const transaction of transactionsDatabase) {
        amountDeposit = Math.floor(amountDeposit + transaction.amount);
    }

    if(amountDeposit < 100 * 1000) {
        throw new Error('You need to have aleast DL100.00 deposited in the past two weeks.');
    }
}

module.exports = {
    generalCheckSendRainCreateData,
    generalCheckSendRainCreateRain,
    generalCheckSendRainCreateUser,
    generalCheckSendRainTipData,
    generalCheckSendRainTipRain,
    generalCheckSendRainTipUser,
    generalCheckSendRainJoinData,
    generalCheckSendRainJoinRain,
    generalCheckSendRainJoinUser,
    generalCheckSendRainJoinTransactions
}
