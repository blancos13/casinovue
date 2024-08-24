// Load database models
const User = require('../../../database/models/User');
const CryptoPrice = require('../../../database/models/CryptoPrice');
const CryptoAddress = require('../../../database/models/CryptoAddress');
const CryptoTransaction = require('../../../database/models/CryptoTransaction');

// Load utils
const {
    socketRemoveAntiSpam
} = require('../../../utils/socket');
const {
    cashierCheckSendCryptoWithdrawData,
    cashierCheckSendCryptoWithdrawUser,
    cashierCheckSendCryptoWithdrawTransactions,
    cashierCryptoGetPrices,
    cashierCryptoGenerateAddress
} = require('../../../utils/cashier/crypto');

const cashierGetCryptoDataSocket = async(io, socket, user, data, callback) => {
    try {
        // Get users crypto deposit addresses and crypto prices from database
        let dataDatabase = await Promise.all([
            CryptoAddress.find({ user: user._id }).select('name address user').lean(),
            CryptoPrice.find({}).select('name price fee').lean()
        ]);

        if(dataDatabase[0].length <= 0) {
            // Generate new crypto addresses with coinpayments api
            const addresses = await Promise.all([
                cashierCryptoGenerateAddress('btc'),
                cashierCryptoGenerateAddress('eth'),
                cashierCryptoGenerateAddress('ltc'),
                cashierCryptoGenerateAddress('usdt.erc20'),
                cashierCryptoGenerateAddress('usdc')
            ]);

            // Save users crypto deposit addresses in database
            await Promise.all([
                CryptoAddress.create({ name: 'btc', address: addresses[0].address, user: user._id }),
                CryptoAddress.create({ name: 'eth', address: addresses[1].address, user: user._id }),
                CryptoAddress.create({ name: 'ltc', address: addresses[2].address, user: user._id }),
                CryptoAddress.create({ name: 'usdt', address: addresses[3].address, user: user._id }),
                CryptoAddress.create({ name: 'usdc', address: addresses[4].address, user: user._id }) 
            ]);

            // Format crypto addresses
            dataDatabase[0] = { btc: addresses[0].address, eth: addresses[1].address, ltc: addresses[2].address };
        } else { 
            // Format crypto addresses
            dataDatabase[0] = dataDatabase[0].reduce((acc, currency) => { acc[currency.name] = currency.address; return acc; }, {});
        }

        // Format crypto prices
        dataDatabase[1] = dataDatabase[1].reduce((acc, currency) => { acc[currency.name] = { price: currency.price, fee: currency.fee }; return acc; }, {});

        callback({ success: true, addresses: dataDatabase[0], prices: dataDatabase[1] });
    } catch(err) {
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierSendCryptoWithdrawSocket = async(io, socket, user, data, callback) => {
    try {
        // Validate sent data
        cashierCheckSendCryptoWithdrawData(data);

        // Validate withdraw user
        cashierCheckSendCryptoWithdrawUser(data, user);

        // Get crypto prices and user active crypto transactions from database
        let dataDatabase = await Promise.all([
            CryptoPrice.findOne({ name: data.currency }).select('name price').lean(),
            CryptoTransaction.find({ user: user._id, state: 'pending' }).select('user state').lean()
        ]);

        // Validate withdraw transactions
        cashierCheckSendCryptoWithdrawTransactions(dataDatabase[1]);

        // Get sent amount
        const amount = Math.floor(data.amount);

        // Get currency amount
        const amountCurrency = Math.floor((amount / 1000) * 2.5 / dataDatabase[0].price * 100000000);

        // Update user and create crypto transaction in database
        dataDatabase = await Promise.all([
            User.findByIdAndUpdate(user._id, {
                $inc: {
                    balance: -amount,
                    'stats.withdraw': amount
                }
            }, { new: true }).select('balance xp stats rakeback mute ban verifiedAt updatedAt').lean(),
            CryptoTransaction.create({
                amount: amount,
                data: {
                    receiver: data.address,
                    currency: data.currency,
                    cryptoAmount: amountCurrency
                },
                type: 'withdraw',
                user: user._id,
                state: 'pending'
            })
        ]);

        // Convert offer to javascript object
        dataDatabase[1] = dataDatabase[1].toObject();

        callback({ success: true, user: dataDatabase[0], transaction: dataDatabase[1] });

        socketRemoveAntiSpam(user._id);
    } catch(err) {
        socketRemoveAntiSpam(socket.decoded._id);
        callback({ success: false, error: { type: 'error', message: err.message } });
    }
}

const cashierCryptoCheckPrices = async() => {
    try {
        // Get crypto prices from coinpayments api
        const dataPrices = await cashierCryptoGetPrices();

        // Get bitcoin price
        const priceBtc = Math.floor(1 / dataPrices.USD.rate_btc * 1000);

        // Update crypto prices in database
        await Promise.all([
            CryptoPrice.findOneAndUpdate({ name: 'btc' }, { 
                price: priceBtc, 
                fee: Math.floor(dataPrices.BTC.tx_fee / 1 * priceBtc) 
            }, { upsert: true }),
            CryptoPrice.findOneAndUpdate({ name: 'eth' }, { 
                price: Math.floor(priceBtc * dataPrices.ETH.rate_btc), 
                fee: Math.floor(dataPrices.ETH.tx_fee / 1 * priceBtc * dataPrices.ETH.rate_btc) 
            }, { upsert: true }),
            CryptoPrice.findOneAndUpdate({ name: 'ltc' }, { 
                price: Math.floor(priceBtc * dataPrices.LTC.rate_btc), 
                fee: Math.floor(dataPrices.LTC.tx_fee / 1 * priceBtc * dataPrices.LTC.rate_btc) 
            }, { upsert: true }),
            CryptoPrice.findOneAndUpdate({ name: 'usdt' }, { 
                price: Math.floor(priceBtc * dataPrices['USDT.ERC20'].rate_btc), 
                fee: Math.floor(dataPrices['USDT.ERC20'].tx_fee / 1 * priceBtc * dataPrices['USDT.ERC20'].rate_btc) 
            }, { upsert: true }),
            CryptoPrice.findOneAndUpdate({ name: 'usdc' }, { 
                price: Math.floor(priceBtc * dataPrices.USDC.rate_btc), 
                fee: Math.floor(dataPrices.USDC.tx_fee / 1 * priceBtc * dataPrices.USDC.rate_btc) 
            }, { upsert: true })
        ]);

        setTimeout(() => { cashierCryptoCheckPrices(); }, 1000 * 60 * 60 * 6);
    } catch(err) {
        setTimeout(() => { cashierCryptoCheckPrices(); }, 1000 * 60 * 60 * 6);
    }
}

const cashierCryptoInit = (io) => {
    try {
        // Check for crypto prices
        cashierCryptoCheckPrices();
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    cashierGetCryptoDataSocket,
    cashierSendCryptoWithdrawSocket,
    cashierCryptoInit
}
