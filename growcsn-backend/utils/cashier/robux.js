const validator = require('validator');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

// Cashier robux variables
let cashierRobuxBlockOffer = [];

const cashierCheckGetRobuxData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.type === undefined || data.type === null || typeof data.type !== 'string' || ['deposit', 'withdraw'].includes(data.type) !== true) {
        throw new Error('Your entered type is invalid.');
    }
}

const cashierCheckGetRobuxDataRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendRobuxDepositData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('Your provided deposit amount is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.ROBUX_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only deposit a minmum amount of DL${parseFloat(process.env.ROBUX_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`);
    }
}

const cashierCheckSendRobuxDepositRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendRobuxDepositUser = (data, cashierUserOfferAmount, robuxData) => {
    if((data.amount + cashierUserOfferAmount) > Math.floor(robuxData * 1000)) {
        throw new Error('You don’t have enough robux for this action.');
    }
}

const cashierCheckSendRobuxWithdrawData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('Your provided withdraw amount is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.ROBUX_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only withdraw a minmum amount of DL${parseFloat(process.env.ROBUX_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`);
    }
}

const cashierCheckSendRobuxWithdrawRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendRobuxWithdrawUser = (user, data) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    } else if(user.limits.betToWithdraw >= 10) {
        throw new Error(`You need to wager ${parseFloat(Math.floor(user.limits.betToWithdraw / 10) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} more before you can withdraw.`);
    } else if(user.limits.blockSponsor === true) {
        throw new Error('You aren\'t allowed to withdraw at the moment.');
    }
}

const cashierCheckSendRobuxCancelData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.offerId === undefined || typeof data.offerId !== 'string' || validator.isMongoId(data.offerId) !== true) {
        throw new Error('Your provided offer id is invalid.');
    }
}

const cashierCheckSendRobuxCancelRoblox = (user) => {
    if(user.roblox === undefined) {
        throw new Error('You need to link your roblox account.');
    }
}

const cashierCheckSendRobuxCancelOffer = (offerDatababase, cashierRobuxBlockOffer) => {
    if(offerDatababase === null) {
        throw new Error('Your requested offer isn\'t available.');
    } else if(offerDatababase.state !== 'created' || cashierRobuxBlockOffer.includes(offerDatababase._id.toString()) === true) {
        throw new Error('You aren\'t allowed to cancel this offer at the moment.');
    }
}

const cashierRobuxGetBlockOffer = () => {
    return cashierRobuxBlockOffer;
}

const cashierRobuxAddBlockOffer = (offerId) => {
    cashierRobuxBlockOffer.push(offerId);
}

const cashierRobuxRemoveBlockOffer = (offerId) => {
    cashierRobuxBlockOffer.splice(cashierRobuxBlockOffer.indexOf(offerId), 1);
}

const cashierRobuxSortOffers = (offers) => {
    let grouped = {};

    for(const offer of offers) {
        const date = new Date(offer.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;

        if (grouped[key] === undefined) { grouped[key] = [offer]; }
        else { grouped[key].push(offer); }
    }

    for(const key in grouped) { grouped[key].sort((a, b) => b.amount - a.amount); }

    return Object.values(grouped).flat();
}

const cashierGetUserRobux = (proxy, robloxCookie) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get user game request
            let response = await fetch(`https://economy.roblox.com/v1/user/currency`, {
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.status === 200) {
                response = await response.json();
                resolve(response.robux);
            } else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(`ERROR: ${response.statusText}`));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierRobuxGetGameId = (proxy, robloxCookie, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };
            
            // Send get user game request
            let response = await fetch(`https://apis.roblox.com/universes/v1/search?CreatorType=User&CreatorTargetId=${userId}&IsArchived=false&PageSize=10&SortParam=GameCreated&SortOrder=Desc`, {
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.status === 200) {
                response = await response.json();
                resolve(response.data[0].id);
            } else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(`ERROR: ${response.statusText}`));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierRobuxGetProducts = (proxy, robloxCookie, gameId) => {
	return new Promise(async (resolve, reject) => {
		try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Create products array
            let products = [];

            // Create page variable
            let page = 1;

            while(true) {
                // Send get dev product request
                let response = await fetch(`https://apis.roblox.com/developer-products/v1/universes/${gameId}/developerproducts?pageNumber=${page}&pageSize=250`, { 
                    agent: proxyAgent,
                    headers: headers 
                });

                // Check if the response is successful
                if(response.status === 200) {
                    response = await response.json();

                    // Add proxies to proxies available array
                    products = [...products, ...response];

                    if(response.length >= 250) { page = page + 1; } 
                    else { break; }
                } else if(response.status === 401) {
                    reject({ relogin: true });
                    break; 
                } else {
                    reject(new Error(`ERROR: ${response.statusText}`)); 
                    break; 
                }
            }

			resolve(products);
		} catch (err) {
			reject(err);
		}
	});
}

const cashierRobuxGetProduct = (proxy, robloxCookie, devProductId) => {
	return new Promise(async (resolve, reject) => {
		try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get dev product request
            let response = await fetch(`https://apis.roblox.com/developer-products/v1/developer-products/${devProductId}`, {
                agent: proxyAgent,
                headers: headers
            });

			// Check if the response is successful
			if (response.status === 200) {
				response = await response.json();
                resolve(response);
			} else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(`ERROR: ${response.statusText}`)); 
            }
		} catch (err) {
			reject(err);
		}
	});
}

const cashierRobuxCreateProduct = (token, proxy, robloxCookie, gameId, productName, productPrice) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send create dev product request
            let response = await fetch(`https://apis.roblox.com/developer-products/v1/universes/${gameId}/developerproducts?name=${productName}&description=&priceInRobux=${productPrice}`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.status === 200) {
                response = await response.json();
                resolve(response);
            } else if(response.status === 401) {
                reject({ relogin: true });
            } else {
                reject(new Error(`ERROR: ${response.statusText}`)); 
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierRobuxUpdateProduct = (token, proxy, robloxCookie, gameId, productId, productName, productPrice) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'content-type': 'application/json-patch+json',
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Create body object
            let body = { Name: productName, PriceInRobux: productPrice };

            // Send create dev product request
            let response = await fetch(`https://apis.roblox.com/developer-products/v1/universes/${gameId}/developerproducts/${productId}/update`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.status === 200) {
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


const cashierRobuxPurchaseProduct = (token, proxy, robloxCookie, devProductId, devProductPrice, devProductSellerId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Create body object
            let body = { expectedCurrency: 1, expectedPrice: devProductPrice, expectedSellerId: devProductSellerId };

            // Send purchase dev product request
            let response = await fetch(`https://economy.roblox.com/v1/purchases/products/${devProductId}`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();

                // Check if the purchase is successful
                if(response.purchased === true) { resolve(); }
                else { reject(new Error(`${response.title}: ${response.errorMsg}`)); }
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {;
            reject(err);
        }
    });
}

module.exports = {
    cashierCheckGetRobuxData,
    cashierCheckGetRobuxDataRoblox,
    cashierCheckSendRobuxDepositData,
    cashierCheckSendRobuxDepositRoblox,
    cashierCheckSendRobuxDepositUser,
    cashierCheckSendRobuxWithdrawData,
    cashierCheckSendRobuxWithdrawRoblox,
    cashierCheckSendRobuxWithdrawUser,
    cashierCheckSendRobuxCancelData,
    cashierCheckSendRobuxCancelRoblox,
    cashierCheckSendRobuxCancelOffer,
    cashierRobuxGetBlockOffer,
    cashierRobuxAddBlockOffer,
    cashierRobuxRemoveBlockOffer,
    cashierRobuxSortOffers,
    cashierGetUserRobux,
    cashierRobuxGetGameId,
    cashierRobuxGetProducts,
    cashierRobuxGetProduct,
    cashierRobuxCreateProduct,
    cashierRobuxUpdateProduct,
    cashierRobuxPurchaseProduct
}