const qs = require('qs'); 
const crypto = require('crypto');

const callbackCheckPostCoinpaymentsData = (headers, data) => {
    if(headers === undefined || data === undefined || headers === null || data === null) {
         throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(headers.hmac === undefined || headers.hmac === undefined || typeof headers.hmac !== 'string') {
        throw new Error('Your provided hmac is invalid.');
    } else if(data.merchant === undefined || data.merchant === null || typeof data.merchant !== 'string' || data.merchant.toString() !== process.env.COINPAYMENTS_MERCHANT.toString()) {
        throw new Error('Your provided merchant is invalid.');
    }
}

const callbackCheckPostCoinpaymentsHmac = (hmac, headers) => {
    if(hmac.toString() !== headers.hmac.toString()) {
        throw new Error('Your provided hmac is invalid.');
    }
}

const callbackCheckPostCoinpaymentsTransaction = (transactionId, callbackBlockTransactionCrypto) => {
    if(callbackBlockTransactionCrypto.includes(transactionId.toString()) === true) {
        throw new Error('Your provided transaction id is currently processed.');
    }
}

const callbackCheckPostSkinifyData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.transaction_id === undefined || isNaN(data.transaction_id) === true) {
        throw new Error('Your provided transaction id is invalid.');
    } else if(data.token_md5 === undefined || typeof data.token_md5 !== 'string') {
        throw new Error('Your provided token is invalid.');
    } else if(data.status === undefined || typeof data.status !== 'string') {
        throw new Error('Your provided status is invalid.');
    }
}

const callbackCheckPostSkinifyToken = (token, data) => {
    if(token.toString() !== data.token_md5.toString()) {
        throw new Error('Your provided token is invalid.');
    }
}

const callbackCheckPostSkinifyTransaction = (transactionId, callbackBlockTransactionSteam) => {
    if(callbackBlockTransactionSteam.includes(transactionId.toString()) === true) {
        throw new Error('Your provided order id is currently processed.');
    }
}

const callbackCheckPostZebrasmarketData = (data) => {
    if(data === undefined || data === null) {
         throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.orderId === undefined) {
        throw new Error('Your provided order id is invalid.');
    }
}

const callbackCheckPostZebrasmarketSignature = (signature, data) => {
    if(signature.toString() !== data.signature.toString()) {
        throw new Error('Your provided signature is invalid.');
    }
}

const callbackCheckPostZebrasmarketTransaction = (transactionId, callbackBlockTransactionCredit) => {
    if(callbackBlockTransactionCredit.includes(transactionId.toString()) === true) {
        throw new Error('Your provided order id is currently processed.');
    }
}

const callbackCoinpaymentsCreateHmac = (body) => {
    const bodyString = qs.stringify(body).replace(/%20/g, '+');
    return crypto.createHmac('sha512', process.env.COINPAYMENTS_SECRET).update(bodyString).digest('hex');
}

const callbackZebrasmarketCreateSignature = (data) => {
    let signature = '';

    for(const key of Object.keys(data).sort()) {
        if(key !== 'signature' && typeof data[key] !== 'object') { signature = signature + data[key]; }
    }

    return crypto.createHash('sha256').update(`${signature + process.env.ZEBRASMARKET_API_KEY}`).digest('hex');
}

module.exports = {
    callbackCheckPostCoinpaymentsData,
    callbackCheckPostCoinpaymentsHmac,
    callbackCheckPostCoinpaymentsTransaction,
    callbackCheckPostSkinifyData,
    callbackCheckPostSkinifyToken,
    callbackCheckPostSkinifyTransaction,
    callbackCheckPostZebrasmarketData,
    callbackCheckPostZebrasmarketSignature,
    callbackCheckPostZebrasmarketTransaction,
    callbackCoinpaymentsCreateHmac,
    callbackZebrasmarketCreateSignature
}