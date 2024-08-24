const crypto = require('crypto');
const ChanceJs = require('chance');

const towersCheckSendBetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('You’ve entered an invalid bet amount.');
    } else if(data.risk === undefined || typeof data.risk !== 'string' || ['easy', 'medium', 'hard'].includes(data.risk) !== true) {
        throw new Error('You’ve entered an invalid risk.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.TOWERS_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only bet a min amount of DL${parseFloat(process.env.TOWERS_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    } else if(Math.floor(data.amount) > Math.floor(process.env.TOWERS_MAX_AMOUNT * 1000)) {
        throw new Error(`You can only bet a max amount of DL${parseFloat(process.env.TOWERS_MAX_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    }
}

const towersCheckSendBetUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const towersCheckSendBetGame = (towersGame) => {
    if(towersGame !== undefined) {
        throw new Error('You need to complete your running towers game first.');
    }
}

const towersCheckSendBetSeed = (seedDatabase) => {
    if(seedDatabase === null) {
        throw new Error('You need to generate a server seed first.');
    }
}

const towersCheckSendRevealData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.tile === undefined || data.tile === null || isNaN(data.tile) === true || Math.floor(data.tile) < 0 || Math.floor(data.tile) > 2) {
        throw new Error('You’ve entered an invalid tile.');
    }
}

const towersCheckSendRevealGame = (towersGame) => {
    if(towersGame === undefined) {
        throw new Error('You’ve no running towers game at the moment.');
    }
}

const towersCheckSendCashoutGame = (towersGame) => {
    if(towersGame === null) {
        throw new Error('You’ve no running towers game at the moment.');
    } else if(towersGame.revealed.length === 0) {
        throw new Error('You’ve to reveal at least one row.');
    }
}

const towersGetGamePayout = (towersGame) => {
    const multiplierPerRow = towersGame.risk === 'easy' ? 1.425 : towersGame.risk === 'medium' ? 1.90 : 2.85;
    return Math.floor(towersGame.amount * Math.pow(multiplierPerRow, towersGame.revealed.length));
}

const towersGenerateDeck = (risk) => {
    let deck = [];

    for(let rowIndex = 0; rowIndex < 8; rowIndex++) {
        const tilesPerRow = risk === 'medium' ? 2 : 3;
        const losePerRow = risk === 'hard' ? 2 : 1;

        deck[rowIndex] = [];
        for(let tileIndex = 0; tileIndex < tilesPerRow; tileIndex++) {
            if(tileIndex < losePerRow) {
                deck[rowIndex].push('lose');
            } else {
                deck[rowIndex].push('coin');
            }
        }
    }

    return deck;
}

const towersShuffleDeck = (deck, combined) => {
    let shuffled = [];

    for(let rowIndex = 0; rowIndex < 8; rowIndex++) {
        const hash = crypto.createHash('sha256').update(`${combined}-${rowIndex}`).digest('hex');

        const chance = new ChanceJs(hash);
        const shuffledRow = chance.shuffle(deck[rowIndex]);
        shuffled.push(shuffledRow);
    }

    return shuffled;
}

const towersSanitizeGame = (towersGame) => {
    let sanitized = JSON.parse(JSON.stringify(towersGame));

    if(sanitized.state !== 'completed') {
        delete sanitized.deck;
        delete sanitized.fair;
    }

    return sanitized;
}

module.exports = {
    towersCheckSendBetData,
    towersCheckSendBetUser,
    towersCheckSendBetGame,
    towersCheckSendBetSeed,
    towersCheckSendRevealData,
    towersCheckSendRevealGame,
    towersCheckSendCashoutGame,
    towersGetGamePayout,
    towersGenerateDeck,
    towersShuffleDeck,
    towersSanitizeGame
}