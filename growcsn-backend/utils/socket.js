let socketActiveConnections = {
    general: [],
    crash: [],
    roll: [],
    blackjack: [],
    duels: [],
    mines: [],
    towers: [],
    unbox: [],
    battles: [],
    upgrader: [],
    cashier: [],
    admin: []
};
let socketActiveRequests = [];

const socketCheckUserData = (user, checkAuth) => {
    if(checkAuth === true && user === null) {
        throw new Error('You need to sign in to perform this action.');
    } else if(checkAuth === true && user.ban !== undefined && new Date(user.ban.expire).getTime() > new Date().getTime()) {
        throw new Error(`You got banned for ${user.ban.type} because of the reason: ${user.ban.reason}.`);
    }
}

const socketCheckUserRank = (user, ranks) => {
    if(user === undefined || ranks === undefined) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(user.rank === undefined || ranks.includes(user.rank) !== true) {
        throw new Error('You are not authorized to perform the requested action.');
    }
}

const socketCheckConnectionLimit = (room, identifier) => {
    return new Promise(async(resolve, reject) => {
        try {
            const count = socketActiveConnections[room].filter((element) => element === identifier.toString()).length;

            if(count >= 5) { throw new Error('Too many active socket connections.'); }
            else { resolve(); }
        } catch(err) {
            reject(err);
        }
    });
}

const socketAddConnectionLimit = (room, identifier) => {
    socketActiveConnections[room].push(identifier.toString());
}

const socketRemoveConnectionLimit = (room, identifier) => {
    const index = socketActiveConnections[room].findIndex((element) => element === identifier.toString());
    if(index !== -1) { socketActiveConnections[room].splice(index, 1); }
}

const socketCheckAntiSpam = (identifier) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(socketActiveRequests.includes(identifier.toString()) === true) {
                throw new Error('You need to slow down, we still processing your last request.');
            } else {
                socketActiveRequests.push(identifier.toString());
                resolve();
            }
        } catch(err) {
            reject(err);
        }
    });
}

const socketRemoveAntiSpam = (identifier) => {
    let index = socketActiveRequests.indexOf(identifier.toString());
    if (index !== -1) { 
        socketActiveRequests.splice(index, 1);
    }
}

module.exports = {
    socketCheckUserData,
    socketCheckUserRank,
    socketCheckConnectionLimit,
    socketAddConnectionLimit,
    socketRemoveConnectionLimit,
    socketCheckAntiSpam,
    socketRemoveAntiSpam
}
