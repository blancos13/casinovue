const ChanceJs = require('chance');

const minesCheckSendBetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('You’ve entered an invalid bet amount.');
    } else if(data.minesCount === undefined || isNaN(data.minesCount) === true || Math.floor(data.minesCount) <= 0 || Math.floor(data.minesCount) > 24) {
        throw new Error('You’ve entered an invalid mines count.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.MINES_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only bet a min amount of DL${parseFloat(process.env.MINES_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    } else if(Math.floor(data.amount) > Math.floor(process.env.MINES_MAX_AMOUNT * 1000)) {
        throw new Error(`You can only bet a max amount of DL${parseFloat(process.env.MINES_MAX_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    }
}

const minesCheckSendBetUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const minesCheckSendBetGame = (minesGame) => {
    if(minesGame !== undefined) {
        throw new Error('You need to complete your running mines game first.');
    }
}

const minesCheckSendBetSeed = (seedDatabase) => {
    if(seedDatabase === null) {
        throw new Error('You need to generate a server seed first.');
    }
}

const minesCheckSendRevealData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.tile === undefined || isNaN(data.tile) === true || Math.floor(data.tile) < 0 || Math.floor(data.tile) > 24) {
        throw new Error('Your entered tile is invalid.');
    }
}

const minesCheckSendRevealGame = (minesGame, data) => {
    if(minesGame === undefined) {
        throw new Error('You have no running mines game at the moment.');
    } else if(minesGame.revealed.some((element) => element.tile === Math.floor(data.tile)) === true) {
        throw new Error('Your entered tile is already revealed.');
    }
}

const minesCheckSendCashoutGame = (minesGame) => {
    if(minesGame === undefined) {
        throw new Error('You have no running mines game at the moment.');
    } else if(minesGame.revealed.length === 0) {
        throw new Error('You need to reveal at least one tile.');
    }
}

const minesGetGameFactorial = (number) => {
    let value = number;
    for (let i = number; i > 1; i--) {
        value = value * (i - 1);
    }
    return value;
}

const minesGetGamePayout = (minesGame) => {
    let multiplier = 0;

    if(minesGame.revealed.length >= 1) {
        const first = 25 === minesGame.revealed.length ? 1 : minesGetGameFactorial(25) / (minesGetGameFactorial(minesGame.revealed.length) * minesGetGameFactorial(25 - minesGame.revealed.length));
        const second = (25 - minesGame.minesCount) === minesGame.revealed.length ? 1 : minesGetGameFactorial(25 - minesGame.minesCount) / (minesGetGameFactorial(minesGame.revealed.length) * minesGetGameFactorial((25 - minesGame.minesCount) - minesGame.revealed.length));

        multiplier = 0.95 * (first / second);
        multiplier = multiplier < 1 ? 1.01 : multiplier;
        multiplier = Math.round(multiplier * 100) / 100;
    }

    return Math.floor(minesGame.amount * multiplier);
}

const minesGetGameDeck = (minesCount, hash) => {
    const chance = new ChanceJs(hash);
    let deck = [];

    for(let i = 0; i < 25; i++) {
        if(i < minesCount) {
            deck.push('mine');
        } else {
            deck.push('coin');
        }
    }

    return chance.shuffle(deck);
}

const minesSanitizeGame = (game) => {
    let sanitized = JSON.parse(JSON.stringify(game));

    if(sanitized.state !== 'completed') {
        delete sanitized.deck;
        delete sanitized.fair;
    }

    return sanitized;
}

module.exports = {
    minesCheckSendBetData,
    minesCheckSendBetUser,
    minesCheckSendBetGame,
    minesCheckSendBetSeed,
    minesCheckSendRevealData,
    minesCheckSendRevealGame,
    minesCheckSendCashoutGame,
    minesGetGamePayout,
    minesGetGameDeck,
    minesSanitizeGame
}