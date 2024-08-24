const validator = require('validator');
const crypto = require('crypto');

// Load database models
const DuelsGame = require('../database/models/DuelsGame');

const duelsCheckGetGameDataData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.gameId === undefined || data.gameId === null || typeof data.gameId !== 'string' || validator.isMongoId(data.gameId) !== true) {
        throw new Error('Your entered game id is invalid.');
    }
}

const duelsCheckGetGameDataGame = (duelsGame) => {
    if(duelsGame === null) {
        throw new Error('Your entered game id is not available.');
    }
}

const duelsCheckSendCreateData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('You’ve entered an invalid bet amount.');
    } else if(data.playerCount === undefined || isNaN(data.playerCount) === true || Math.floor(data.playerCount) <= 1 || Math.floor(data.playerCount) > 10) {
        throw new Error('Your entered player count is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.DUELS_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only bet a min amount of DL${parseFloat(process.env.DUELS_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    } else if(Math.floor(data.amount) > Math.floor(process.env.DUELS_MAX_AMOUNT * 1000)) {
        throw new Error(`You can only bet a max amount of DL${parseFloat(process.env.DUELS_MAX_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} per game.`);
    }
}

const duelsCheckSendCreateUser = (data, user, userGames) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    } else if(userGames.length >= 6) {
        throw new Error('You are not allowed to have more then 6 open duels games.');
    }
}

const duelsCheckSendBotData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.gameId === undefined || typeof data.gameId !== 'string' || validator.isMongoId(data.gameId) !== true) {
        throw new Error('Your entered game id is invalid.');
    }
}

const duelsCheckSendBotGame = (user, duelsGame, duelsBlockGame, duelsBlockJoin) => {
    if(duelsGame === undefined || duelsGame.state !== 'created' || duelsBlockGame.includes(duelsGame._id.toString()) === true || duelsGame.playerCount <= Math.floor(duelsGame.bets.length + duelsBlockJoin.filter((element) => element.toString() === duelsGame._id.toString()).length)) {
        throw new Error('Your requested game is not available or completed.');
    } else if(user._id.toString() !== duelsGame.bets[0].user._id.toString()) {
        throw new Error('You aren`t allowed to call bots for this game.');
    }
}

const duelsCheckSendJoinData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.gameId === undefined || typeof data.gameId !== 'string' || validator.isMongoId(data.gameId) !== true) {
        throw new Error('Your entered game id is invalid.');
    }
}

const duelsCheckSendJoinGame = (user, duelsGame, duelsBlockGame, duelsBlockJoin) => {
    if(duelsGame === undefined || duelsGame.state !== 'created' || duelsBlockGame.includes(duelsGame._id.toString()) === true || duelsGame.playerCount <= Math.floor(duelsGame.bets.length + duelsBlockJoin.filter((element) => element.toString() === duelsGame._id.toString()).length)) {
        throw new Error('Your requested game is not available or completed.');
    } else if(duelsGame.bets.some((element) => element.user._id.toString() === user._id.toString()) === true) {
       throw new Error('You are not allowed to join more then one time per duels game.');
    }
}

const duelsCheckSendJoinUser = (user, duelsGame) => {
    if(user.balance < Math.floor(duelsGame.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    }
}

const duelsCheckSendCancelData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.gameId === undefined || typeof data.gameId !== 'string' || validator.isMongoId(data.gameId) !== true) {
        throw new Error('Your entered game id is invalid.');
    }
}

const duelsCheckSendCancelGame = (user, duelsGame, duelsBlockGame, duelsBlockJoin) => {
    if(duelsGame === undefined || duelsGame.state !== 'created' || duelsBlockGame.includes(duelsGame._id.toString()) === true || duelsGame.playerCount <= Math.floor(duelsGame.bets.length + duelsBlockJoin.filter((element) => element.toString() === duelsGame._id.toString()).length)) {
        throw new Error('Your requested game is not available or completed.');
    } else if(user._id.toString() !== duelsGame.bets[0].user._id.toString()) {
        throw new Error('You aren`t allowed to cancel this game.');
    }
}

const duelsGenerateGame = (amount, playerCount) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Generate new duels server seed
            const seedServer = crypto.randomBytes(24).toString('hex');

            // Hash new generated duels server seed
            const hash = crypto.createHash('sha256').update(seedServer).digest('hex');

            // Create new duels game in database
            let gameDatabase = await DuelsGame.create({
                amount: amount,
                playerCount: playerCount,
                fair: {
                    seedServer: seedServer,
                    hash: hash
                },
                state: 'created'
            });

            // Convert game object to javascript object
            gameDatabase = gameDatabase.toObject();

            resolve(gameDatabase);
        } catch(err) {
            reject(err);
        }
    });
}

const duelsGetGameIndex = (duelsGames, gameId) => {
    return duelsGames.findIndex((element) => element._id.toString() === gameId.toString());
}

const duelsSanitizeGames = (games) => {
    let sanitized = [];

    for(let game of games) {
        game = JSON.parse(JSON.stringify(game));

        // Sanitize game fair property
        if(game.state !== 'completed') { game.fair = { hash: game.fair.hash }; }
        
        // Sanitize game bets user property
        for(let bet of game.bets) { 
            bet.user = bet.bot === true ? {} : {
                _id: bet.user._id, 
                roblox: bet.user.roblox, 
                username: bet.user.username, 
                avatar: bet.user.avatar, 
                rank: bet.user.rank,
                level: bet.user.level,
                rakeback: bet.user.rakeback.name,
                stats: bet.user.stats,
                createdAt: bet.user.createdAt
            };
        }

        // Add sanitized game to sanitized list
        sanitized.push(game);
    }

    return sanitized;
}

const duelsSanitizeGame = (game) => {
    let sanitized = JSON.parse(JSON.stringify(game));

    // Sanitize game fair property
    if(sanitized.state !== 'completed') { sanitized.fair = { hash: sanitized.fair.hash }; }

    // Sanitize game bets user property
    for(let bet of sanitized.bets) { 
        bet.user = bet.bot === true ? {} : {
            _id: bet.user._id, 
            roblox: bet.user.roblox,
            username: bet.user.username, 
            avatar: bet.user.avatar, 
            rank: bet.user.rank,
            level: bet.user.level,
            rakeback: bet.user.rakeback.name,
            stats: bet.user.stats,
            createdAt: bet.user.createdAt
        };
    }

    return sanitized;
}

module.exports = {
    duelsCheckGetGameDataData,
    duelsCheckGetGameDataGame,
    duelsCheckSendCreateData,
    duelsCheckSendCreateUser,
    duelsCheckSendBotData,
    duelsCheckSendBotGame,
    duelsCheckSendJoinData,
    duelsCheckSendJoinGame,
    duelsCheckSendJoinUser,
    duelsCheckSendCancelData,
    duelsCheckSendCancelGame,
    duelsGenerateGame,
    duelsGetGameIndex,
    duelsSanitizeGames,
    duelsSanitizeGame
}
