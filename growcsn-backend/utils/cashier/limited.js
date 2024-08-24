const validator = require('validator');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const cashierCheckSendLimitedEnableRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendLimitedGenerateType = (twoStepType) => {
    if(twoStepType === null) {
        throw new Error('You need to change your 2fa method to emails or the authenticator app.');
    }
}

const cashierCheckSendLimitedVerifyData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.challengeId === undefined || typeof data.challengeId !== 'string' || data.challengeId.length > 36) {
        throw new Error('Your provided two challenge id is invalid.');
    } else if(data.twoStepCode === undefined || typeof data.twoStepCode !== 'string' || validator.isAlphanumeric(data.twoStepCode) !== true) {
        throw new Error('Your provided two step code is invalid.');
    }
}

const cashierCheckSendLimitedVerifyRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendLimitedDepositData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.items === undefined || Array.isArray(data.items) !== true || data.items.length <= 0 || data.items.length > 4) {
        throw new Error('Your provided items are invalid.');
    }
}

const cashierCheckSendLimitedDepositRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendLimitedDepositItems = (data, itemDatabase, transactionsDatabase) => {
    let checked = [];

    for(const item of data.items) {
        if(item === null || item.uniqueId === undefined || checked.includes(item.uniqueId) === true || itemDatabase.some((element) => element.uniqueId === item.uniqueId) !== true) {
            throw new Error('Your provided items are invalid.');
        } else if(transactionsDatabase.some((trade) => trade.deposit.items.some((element) => element.uniqueId === item.uniqueId) === true) === true) {
            throw new Error('Your provided items are already used in a different transaction.');
        }

        checked.push(item.uniqueId);
    }
}

const cashierCheckSendLimitedDepositUser = (user, transactionsDatabase, transactionsCanceledDatabase, canTradeRoblox) => {
    if(user.verifiedAt === undefined || new Date().getTime() > new Date(user.verifiedAt).getTime() + (1000 * 60 * 30)) {
        throw new Error('You reached your two step verification thresholds.');
    } else if(transactionsDatabase.length >= 12) {
        throw new Error('You can only have 12 active limited listings per time.');
    } else if(transactionsCanceledDatabase >= 8) {
        throw new Error('You got to many canceled limited listings in the last hour.');
    } else if(canTradeRoblox.canTrade !== true && canTradeRoblox.status === 'SenderCannotTrade') {
        throw new Error('You aren\'t able to trade. Please check your roblox account.');
    }
}

const cashierCheckSendLimitedWithdrawData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.transactionId === undefined || typeof data.transactionId !== 'string' || validator.isMongoId(data.transactionId) !== true) {
        throw new Error('Your provided transaction id is invalid.');
    }
}

const cashierCheckSendLimitedWithdrawRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendLimitedWithdrawTransaction = (user, transactionDatabase, cashierLimitedBlockTransaction) => {
    if(transactionDatabase === null || transactionDatabase.state !== 'created' || cashierLimitedBlockTransaction.includes(transactionDatabase._id.toString()) === true) {
        throw new Error('Your provided limited listing id is not available.');
    } else if(user._id.toString() === transactionDatabase.deposit.user._id.toString()) {
        throw new Error('You aren\'t allowed withdraw your own limited listing.');
    }
}

const cashierCheckSendLimitedWithdrawUser = (user, amountTransaction, canTradeRoblox) => {
    if(user.balance < amountTransaction) {
        throw new Error('You don’t have enough balance for this action.');
    } else if(user.verifiedAt === undefined || new Date().getTime() > new Date(user.verifiedAt).getTime() + (1000 * 60 * 30)) {
        throw new Error('You reached your two step verification thresholds. Please verify again.');
    } else if(canTradeRoblox.canTrade !== true && canTradeRoblox.status === 'SenderCannotTrade') {
        throw new Error('You aren\'t able to trade. Please check your roblox account.');
    } else if(user.limits.betToWithdraw >= 10) {
        throw new Error(`You need to wager ${parseFloat(Math.floor(user.limits.betToWithdraw / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} more before you can withdraw.`);
    } else if(user.limits.blockSponsor === true) {
        throw new Error('You aren\'t allowed to withdraw at the moment.');
    }
}

const cashierLimitedGetDummyItem = (items, transactionsDatabase) => {
    let dummy = null;

    for(const item of items.sort((a, b) => a.price - b.price)) {
        if(
            item.amount <= (process.env.LIMITED_MAX_AMOUNT_DUMMY * 1000) &&
            transactionsDatabase.some((transaction) => transaction.deposit.items.some((element) => element.uniqueId === item.uniqueId) === true) === false
        ) {
            dummy = item;
        }
    }

    if(dummy !== null) { 
        return dummy; 
    } else { throw new Error('You dont have a valid dummy item in your inventory.'); }
}

const cashierLimitedGetInventory = async(proxy, robloxId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Send get limited items request
            let response = await fetch(`https://inventory.roblox.com/v1/users/${robloxId}/assets/collectibles`, {
                agent: proxyAgent
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response.data);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierLimitedGetItems = () => {
    return new Promise(async(resolve, reject) => {
        try {
            // Send get limited items request
            let response = await fetch('https://www.rolimons.com/itemapi/itemdetails');

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response.items);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierLimitedGetItemImages = async(itemIds) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create limited images array
            let limitedImages = [];

            // Get limited images and add to images array
            for(let i = 0; i <= Math.floor(itemIds.length / 100); i++) {
                // Send get limited items images request
                let response = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemIds.slice(i * 100, (i + 1) * 100).join(',')}&size=110x110&format=png`);

                // Check if the response is successful
                if(response.ok) {
                    response = await response.json();
                    limitedImages = [ ...limitedImages, ...response.data ];
                } else {
                    reject(new Error(response.statusText));
                }

                // Wait for 500ms
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            resolve(limitedImages);
        } catch(err) {
            reject(err);
        }
    });
}

const cashierGetUserCanTrade = (proxy, robloxCookie, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get user can trade request
            let response = await fetch(`https://trades.roblox.com/v1/users/${userId}/can-trade-with`, {
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response);
            } else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierLimitedGetTransaction = (proxy, robloxCookie, tradeId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get user can trade request
            let response = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}`, {
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierSendLimitedTwoStepRedeem = (token, proxy, robloxCookie, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send redeem two step challenge request
            let response = await fetch(`https://trades.roblox.com/v1/trade-friction/two-step-verification/redeem`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                console.log(response);
                resolve();
            } else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierLimitedSendTrade = (token, proxy, robloxCookie, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send roblox limited trade request
            let response = await fetch(`https://trades.roblox.com/v1/trades/send`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve({ success: true, tradeId: response.id });
            } else {
                resolve({ success: false });
            }
        } catch(err) {
            resolve({ success: false });
        }
    });
}

const cashierLimitedSendTradeAccept = (token, proxy, robloxCookie, tradeId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send accept roblox limited trade request
            let response = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}/accept`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve({ success: true, tradeId: tradeId });
            } else {
                resolve({ success: false, tradeId: tradeId });
            }
        } catch(err) {
            resolve({ success: false, tradeId: tradeId });
        }
    });
}

const cashierLimitedSendTradeDecline = (token, proxy, robloxCookie, tradeId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send accept roblox limited trade request
            let response = await fetch(`https://trades.roblox.com/v1/trades/${tradeId}/decline`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve({ success: true, tradeId: tradeId });
            } else {
                resolve({ success: false, tradeId: tradeId });
            }
        } catch(err) {
            resolve({ success: false, tradeId: tradeId });
        }
    });
}

const cashierLimitedFormatItems = (inventoryRoblox, itemsDatabase) => {
    let formated = [];

    for(const item of inventoryRoblox) {
        const index = itemsDatabase.findIndex((element) => element.assetId.toString() === item.assetId.toString());

        if(index !== -1) {
            formated.push({
                uniqueId: item.userAssetId,
                assetId: item.assetId,
                name: item.name,
                image: itemsDatabase[index].image,
                amount: itemsDatabase[index].amount
            });
        }
    }

    return formated;
}

const cashierLimitedFormatDepositItems = (data, itemsDatabase) => {
    let formated = [];

    for(const item of data.items) {
        const index = itemsDatabase.findIndex((element) => element.uniqueId === item.uniqueId);
        if(index !== -1) { formated.push(itemsDatabase[index]); }
    }

    return formated;
}

const cashierLimitedFormatTransactions = (transactions) => {
    let formated = [];

    for(const transaction of transactions) {
        formated.push({
            _id: transaction._id,
            amount: transaction.amount,
            items: transaction.deposit.items,
            user: transaction.deposit.user._id || transaction.deposit.user,
            state: transaction.state
        });
    }

    return formated;
}

const cashierLimitedFormatTransaction = (transaction) => {
    return {
        _id: transaction._id,
        amount: transaction.amount,
        items: transaction.deposit.items,
        user: transaction.deposit.user._id || transaction.deposit.user,
        state: transaction.state
    }
}

module.exports = {
    cashierCheckSendLimitedEnableRoblox,
    cashierCheckSendLimitedGenerateType,
    cashierCheckSendLimitedVerifyData,
    cashierCheckSendLimitedVerifyRoblox,
    cashierCheckSendLimitedDepositData,
    cashierCheckSendLimitedDepositRoblox,
    cashierCheckSendLimitedDepositItems,
    cashierCheckSendLimitedDepositUser,
    cashierCheckSendLimitedWithdrawData,
    cashierCheckSendLimitedWithdrawRoblox,
    cashierCheckSendLimitedWithdrawTransaction,
    cashierCheckSendLimitedWithdrawUser,
    cashierLimitedGetDummyItem,
    cashierLimitedGetInventory,
    cashierLimitedGetItems,
    cashierLimitedGetItemImages,
    cashierGetUserCanTrade,
    cashierLimitedGetTransaction,
    cashierSendLimitedTwoStepRedeem,
    cashierLimitedSendTrade,
    cashierLimitedSendTradeAccept,
    cashierLimitedSendTradeDecline,
    cashierLimitedFormatItems,
    cashierLimitedFormatDepositItems,
    cashierLimitedFormatTransactions,
    cashierLimitedFormatTransaction
}