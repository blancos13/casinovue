const crypto = require('crypto');
const ChanceJs = require('chance');

// Load database models
const BlackjackGame = require('../database/models/BlackjackGame');

// Blackjack variables
const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardSuits = ['heart', 'spade', 'diamond','club'];

const blackjackCheckSendJoinData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.seat === undefined || isNaN(data.seat) === true || ['0', '1', '2', '3', '4'].includes(data.seat.toString()) === false) {
        throw new Error('Your entered table seat is invalid.');
    }
}

const blackjackCheckSendJoinTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || (blackjackTable.game.state !== 'created' && blackjackTable.game.state !== 'countdown')) {
        throw new Error('Your requested table is not available.');
    } else if(blackjackTable.players.some((element) => element.seat === data.seat) === true) {
        throw new Error('Your requested table seat is already occupied.');
    } else if(blackjackTable.players.filter((element) => element.user._id.toString() === user._id.toString()).length >= 3) {
        throw new Error('You aren’t allowed to sit at more than three seats at once.');
    } else if(blackjackTable.players.some((element) => element.user._id.toString() === user._id.toString() && element.bet === null) === true) {
        throw new Error('You need to place a bet first on your other seats.');
    }
}

const blackjackCheckSendJoinUser = (user, blackjackTable) => {
    if(user.balance < Math.floor(blackjackGetBetAmountMin(blackjackTable.game.type) * 1000)) {
        throw new Error('You have not enough balance for this action.');
    }
}

const blackjackCheckSendBetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.bets === undefined || Array.isArray(data.bets) !== true || data.bets.length <= 0) {
        throw new Error('Your provided bets are invalid.');
    }
}

const blackjackCheckSendBetTable = (blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'countdown') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendBetBets = (bets) => {
    let checked = [];

    for(const bet of bets) {
        if(bet === undefined || bet === null) {
            throw new Error('Your provided bets are invalid.');
        } else if(bet.seat === undefined || isNaN(bet.seat) === true || ['0', '1', '2', '3', '4'].includes(bet.seat.toString()) === false) {
            throw new Error('Your provided table seat is invalid.');
        } else if(bet.amount === undefined || bet.amount === null) {
            throw new Error('You’ve provided an invalid bet amount.');
        } else if(bet.amount.main === undefined || isNaN(bet.amount.main) === true || Math.floor(bet.amount.main) < 0) {
            throw new Error('You’ve provided an invalid main bet amount.');
        } else if(bet.amount.sideLeft === undefined || isNaN(bet.amount.sideLeft) === true || Math.floor(bet.amount.sideLeft) < 0) {
            throw new Error('You’ve provided an invalid side bet amount.');
        } else if(bet.amount.sideRight === undefined || isNaN(bet.amount.sideRight) === true || Math.floor(bet.amount.sideRight) < 0) {
            throw new Error('You’ve provided an invalid side bet amount.');
        } else if(checked.includes(bet.seat.toString()) === true) {
            throw new Error('You’ve provided multiple bets for one seat.');
        }

        checked.push(bet.seat.toString());
    }
}

const blackjackCheckSendBetSeat = (bet, user, blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined || blackjackSeat.user._id.toString() !== user._id.toString()) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackGetBetAmount(bet.amount) <= 0 || [Math.floor(bet.amount.main), Math.floor(bet.amount.sideLeft), Math.floor(bet.amount.sideRight)].some((element) => element !== 0 && element < Math.floor(blackjackGetBetAmountMin(blackjackTable.game.type) * 1000)) === true) {
        throw new Error(`You can only bet a min amount of DL${parseFloat(blackjackGetBetAmountMin(blackjackTable.game.type)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per seat.`);
    } else if(Math.floor((blackjackSeat.bet === null ? 0 : blackjackGetBetAmount(blackjackSeat.bet.amount)) + blackjackGetBetAmount(bet.amount)) > Math.floor(blackjackGetBetAmountMax(blackjackTable.game.type) * 1000)) {
        throw new Error(`You can only bet a total max amount of DL${parseFloat(blackjackGetBetAmountMax(blackjackTable.game.type)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per seat.`);
    } else if((Math.floor(bet.amount.sideLeft) > 0 || Math.floor(bet.amount.sideRight) > 0) && Math.floor(bet.amount.main) <= 0 && blackjackSeat.bet === null) {
        throw new Error('You need to place a main bet before you can place side bets.');
    } else if(new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    }
}

const blackjackCheckSendBetUser = (user, amount) => {
    if(user.balance < amount) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const blackjackCheckSendClearData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    }
}

const blackjackCheckSendClearTable = (blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'countdown') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendClearSeat = (blackjackTable, blackjackSeats) => {
    if(blackjackSeats.length <= 0) {
        throw new Error('You haven`t placed a bet yet.');
    } else if(new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    }
}

const blackjackCheckSendInsuranceData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.insurance === undefined || typeof data.insurance !== 'boolean') {
        throw new Error('Your entered insurance value is invalid.');
    }
}

const blackjackCheckSendInsuranceTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'running') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendInsuranceSeat = (blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackTable.playersPos !== 'all' || new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    } else if(blackjackSeat.bet.actions.length > 1 || blackjackSeat.bet.actions.includes('insurance') === true || blackjackSeat.bet.actions.includes('noinsurance') === true) {
        throw new Error('Your requested action is not available for your seat.');
    }
}

const blackjackCheckSendInsuranceUser = (data, user, amount) => {
    if(data.insurance === true && user.balance < Math.floor(amount)) {
        throw new Error('You have not enough balance for this action!');
    }
}

const blackjackCheckSendHitData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.seat === undefined || isNaN(data.seat) === true || ['0', '1', '2', '3', '4'].includes(data.seat.toString()) === false) {
        throw new Error('Your entered table seat is invalid.');
    }
}

const blackjackCheckSendHitTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'running') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendHitSeat = (user, blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined || blackjackSeat.user._id.toString() !== user._id.toString()) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackTable.playersPos !== blackjackSeat.seat || new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    } else if(blackjackSeat.bet.actions.includes('double') === true) {
        throw new Error('Your requested action is not available for your seat.');
    } else if(blackjackSeat.bet.actions.includes('split') === false && (blackjackSeat.bet.actions.includes('stand') === true || blackjackGetCardsValue(blackjackSeat.bet.cards) >= 21)) {
        throw new Error('Your requested action is not available for your seat.');
    }
}

const blackjackCheckSendStandData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.seat === undefined || isNaN(data.seat) === true || ['0', '1', '2', '3', '4'].includes(data.seat.toString()) === false) {
        throw new Error('Your entered table seat is invalid.');
    }
}

const blackjackCheckSendStandTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'running') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendStandSeat = (user, blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined || blackjackSeat.user._id.toString() !== user._id.toString()) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackTable.playersPos !== blackjackSeat.seat || new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    } else if(
        blackjackSeat.bet.actions.includes('double') === true || (blackjackSeat.bet.actions.includes('split') === false && (blackjackSeat.bet.actions.includes('stand') === true || blackjackGetCardsValue(blackjackSeat.bet.cards) >= 21)) ||
        (
            blackjackSeat.bet.actions.includes('split') === true && 
            (
                blackjackSeat.bet.actions.filter((element) => element === 'stand').length >= 2 ||
                (blackjackSeat.bet.actions.includes('stand') === true && (blackjackGetCardsValue(blackjackSeat.bet.cardsLeft) >= 21 || blackjackGetCardsValue(blackjackSeat.bet.cardsRight) >= 21)) ||
                (blackjackGetCardsValue(blackjackSeat.bet.cardsLeft) >= 21 && blackjackGetCardsValue(blackjackSeat.bet.cardsRight) >= 21)
            )
        )
    ) {
        throw new Error('Your requested action is not available for your seat.');
    }
}

const blackjackCheckSendSplitData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.seat === undefined || isNaN(data.seat) === true || ['0', '1', '2', '3', '4'].includes(data.seat.toString()) === false) {
        throw new Error('Your entered table seat is invalid.');
    }
}

const blackjackCheckSendSplitTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'running') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendSplitSeat = (user, blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined || blackjackSeat.user._id.toString() !== user._id.toString()) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackTable.playersPos !== blackjackSeat.seat || new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    } else if(blackjackSeat.bet.actions.includes('split') === true) {
        throw new Error('Your requested action is not available for your seat.');
    } else if(blackjackSeat.bet.cards.length !== 2 || blackjackSeat.bet.cards[0].rank !== blackjackSeat.bet.cards[1].rank) {
        throw new Error('Your requested action is not available for your seat.');
    }
}

const blackjackCheckSendSplitUser = (user, blackjackSeat) => {
    if(user.balance < Math.floor(blackjackSeat.bet.amount.main)) {
        throw new Error('You have not enough balance for this action.');
    }
}

const blackjackCheckSendDoubleData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.table === undefined || isNaN(data.table) === true || Math.floor(data.table) < 0) {
        throw new Error('Your entered table id is invalid.');
    } else if(data.seat === undefined || isNaN(data.seat) === true || ['0', '1', '2', '3', '4'].includes(data.seat.toString()) === false) {
        throw new Error('Your entered table seat is invalid.');
    }
}

const blackjackCheckSendDoubleTable = (data, user, blackjackTable) => {
    if(blackjackTable === undefined || blackjackTable.game.state !== 'running') {
        throw new Error('Your requested table is not available.');
    }
}

const blackjackCheckSendDoubleSeat = (user, blackjackTable, blackjackSeat) => {
    if(blackjackSeat === undefined || blackjackSeat.user._id.toString() !== user._id.toString()) {
        throw new Error('Your requested table seat is not available.');
    } else if(blackjackTable.playersPos !== blackjackSeat.seat || new Date().getTime() >= new Date(blackjackTable.game.updatedAt).getTime() + 1000 * 10) {
        throw new Error('Your requested table seat is not allowed to act.');
    } else if(blackjackSeat.bet.actions.includes('split') === true) {
        throw new Error('Your requested action is not available for your seat.');
    } else if(blackjackSeat.bet.cards.length !== 2 || blackjackGetCardsValue(blackjackSeat.bet.cards) < 9 || blackjackGetCardsValue(blackjackSeat.bet.cards) > 11) {
        throw new Error('Your requested action is not available for your seat.');
    }
}

const blackjackCheckSendDoubleUser = (user, blackjackSeat) => {
    if(user.balance < Math.floor(blackjackSeat.bet.amount.main)) {
        throw new Error('You have not enough balance for this action.');
    }
}

const blackjackGenerateGame = (table, type) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Generate blackjack server seed
            const seedServer = crypto.randomBytes(24).toString('hex');

            // Hash new generated duels server seed
            const hash = crypto.createHash('sha256').update(seedServer).digest('hex');

            // Create new duels game in database
            let gameDatabase = await BlackjackGame.create({
                fair: {
                    seedServer: seedServer,
                    hash: hash
                },
                table: table,
                type: type,
                state: 'created'
            });

            // Convert transaction to javascript object
            gameDatabase = gameDatabase.toObject();

            resolve(gameDatabase);
        } catch(err) {
            reject(err);
        }
    });
}

const blackjackGenerateDeck = () => {
    let deck = [];

    for(var d = 0; d < process.env.BLACKJACK_DECK_COUNT; d++) {
        for(var s = 0; s < cardSuits.length; s++) {
            for(let r = 0; r < cardRanks.length; r++) {
                deck.push({ rank: cardRanks[r], suit: cardSuits[s] });
            }
        }
    }

    return deck;
}

const blackjackShuffleDeck = (deck, combined) => {
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    const chance = new ChanceJs(hash);
    const shuffled = chance.shuffle(deck);

    return shuffled;
}

const blackjackGetCardsValue = (cards) => {
    let value = 0;
    let aces = false;

    for(const card of cards) {
         if(card.rank === 'A') {
            value = value + 1;
            aces = true;
        } else if(card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
            value = value + 10;
        } else {
            value = value + Math.floor(card.rank);
        }
    }

    if(aces === true && value <= 11) {
        value = value + 10;
    }

    return value;
}

const blackjackGetCardColor = (card) => {
    color = '';

    if(['heart', 'diamond'].includes(card.suit) === true) { color = 'red'; }
    else { color = 'black'; }

    return color;
}

const blackjackCheckCardsSoftSeventeen = (cards) => {
    let value = 0;
    let aces = false;

    for(const card of cards) {
         if(card.rank === 'A') {
            value = value + 1;
            aces = true;
        } else if(card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') {
            value = value + 10;
        } else {
            value = value + Math.floor(card.rank);
        }
    }

    if(aces === true && value === 7) {
        return true;
    }

    return false;
}

const blackjackCheckCardsStraight = (cards) => {
    let straight = false;

    // Format cards for only the rank values
    cards = cards.map((element) => { return blackjackGetCardsValue([element]); });

    // Sort cards array by value
    cards.sort((a, b) => { return a - b; });

    // Remove duplicate numbers
    cards = [...new Set(cards)];

    if(cards.length === 3) {
        if((cards[2] - cards[0]) !== 2 && cards.includes(11) === true) { cards = [1, cards[0], cards[1]]; }
        if((cards[2] - cards[0]) === 2) { straight = true; }
    }

    return straight;
}

const blackjackTableListSanitize = (tables) => {
    let sanitized = [];

    for(let table of tables) {
        table = JSON.parse(JSON.stringify(table));

        // Sanitize game fair property
        if(table.game.state !== 'completed') {
            delete table.game.deck;
            delete table.game.fair.seedServer;
            if(table.game.state === 'running' && table.game.dealerCards[1] !== undefined) { table.game.dealerCards[1] = { rank: 'hidden', suit: 'hidden' }; }
        }

        // Sanitize game players user property
        for(let player of table.players) { 
            player.user = {
                _id: player.user._id, 
                roblox: player.user.roblox, 
                username: player.user.username, 
                avatar: player.user.avatar, 
                rank: player.user.rank,
                level: player.user.level,
                rakeback: player.user.rakeback.name,
                stats: player.user.stats,
                createdAt: player.user.createdAt
            };
        }

        sanitized.push(table);
    }

    return sanitized;
}

const blackjackTableSanitize = (table) => {
    let sanitized = JSON.parse(JSON.stringify(table));

    // Sanitize game fair property
    if(sanitized.game.state !== 'completed') {
        delete sanitized.game.deck;
        delete sanitized.game.fair.seedServer;
        if(sanitized.game.state === 'running' && sanitized.game.dealerCards[1] !== undefined) { sanitized.game.dealerCards[1] = { rank: 'hidden', suit: 'hidden' }; }
    }

    // Sanitize game players user property
    for(let player of sanitized.players) {
        player.user = {
            _id: player.user._id, 
            roblox: player.user.roblox, 
            username: player.user.username, 
            avatar: player.user.avatar, 
            rank: player.user.rank,
            level: player.user.level,
            rakeback: player.user.rakeback.name,
            stats: player.user.stats,
            createdAt: player.user.createdAt
        };
    }

    return sanitized;
}

const blackjackGetBetAmountMin = (type) => {
    let amount = process.env.BLACKJACK_MIN_AMOUNT_STANDARD;

    if(type === 'whale') { amount = process.env.BLACKJACK_MIN_AMOUNT_WHALE; }

    return amount;
}

const blackjackGetBetAmountMax = (type) => {
    let amount = process.env.BLACKJACK_MAX_AMOUNT_STANDARD;

    if(type === 'whale') { amount = process.env.BLACKJACK_MAX_AMOUNT_WHALE; }

    return amount;
}

const blackjackGetBetAmount = (amount) => {
    return Math.floor(amount.main + amount.sideLeft + amount.sideRight);
}

const blackjackGetSideBetMultiplier = (cardsDealer, cardsPlayer) => {
    let multiplier = { left: 0, right: 0 };

    // Get left side bets multiplier
    if(cardsPlayer[0].rank === cardsPlayer[1].rank && blackjackGetCardColor(cardsPlayer[0]) === blackjackGetCardColor(cardsPlayer[1])) {
        multiplier.left = cardsPlayer[0].suit === cardsPlayer[1].suit ? 25 : 10;
    }

    // Get right side bets multiplier
    if(cardsDealer[0].rank === cardsPlayer[0].rank === cardsPlayer[1].rank) {
        multiplier.right = cardsDealer[0].suit === cardsPlayer[0].suit === cardsPlayer[1].suit ? 100 : 30;
    } else if(blackjackCheckCardsStraight([cardsDealer[0], cardsPlayer[0], cardsPlayer[1]]) === true) {
        multiplier.right = cardsDealer[0].suit === cardsPlayer[0].suit === cardsPlayer[1].suit ? 40 : 10;
    } else if(cardsDealer[0].suit === cardsPlayer[0].suit === cardsPlayer[1].suit) {
        multiplier.right = 5;
    }

    return multiplier;
}

module.exports = {
    blackjackCheckSendJoinData,
    blackjackCheckSendJoinTable,
    blackjackCheckSendJoinUser,
    blackjackCheckSendBetData,
    blackjackCheckSendBetTable,
    blackjackCheckSendBetBets,
    blackjackCheckSendBetSeat,
    blackjackCheckSendBetUser,
    blackjackCheckSendClearData,
    blackjackCheckSendClearTable,
    blackjackCheckSendClearSeat,
    blackjackCheckSendInsuranceData,
    blackjackCheckSendInsuranceTable,
    blackjackCheckSendInsuranceSeat,
    blackjackCheckSendInsuranceUser,
    blackjackCheckSendHitData,
    blackjackCheckSendHitTable,
    blackjackCheckSendHitSeat,
    blackjackCheckSendStandData,
    blackjackCheckSendStandTable,
    blackjackCheckSendStandSeat,
    blackjackCheckSendSplitData,
    blackjackCheckSendSplitTable,
    blackjackCheckSendSplitSeat,
    blackjackCheckSendSplitUser,
    blackjackCheckSendDoubleData,
    blackjackCheckSendDoubleTable,
    blackjackCheckSendDoubleSeat,
    blackjackCheckSendDoubleUser,
    blackjackGenerateGame,
    blackjackGenerateDeck,
    blackjackShuffleDeck,
    blackjackGetCardsValue,
    blackjackCheckCardsSoftSeventeen,
    blackjackTableListSanitize,
    blackjackTableSanitize,
    blackjackGetBetAmountMin,
    blackjackGetBetAmountMax,
    blackjackGetBetAmount,
    blackjackGetSideBetMultiplier
}
