const crypto = require('crypto');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

const cashierCheckSendCreditDepositData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.amount === undefined || isNaN(data.amount) === true || Math.floor(data.amount) < 10) {
        throw new Error('Your provided deposit amount is invalid.');
    } else if(Math.floor(data.amount) < Math.floor(process.env.CREDIT_MIN_AMOUNT * 1000)) {
        throw new Error(`You can only deposit a min amount of DL${parseFloat(process.env.CREDIT_MIN_AMOUNT).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`);
    }
}

const cashierCreditCreateSignature = (body) => {
    let signature = '';

    for(const key of Object.keys(body).sort()) {
        if(key !== 'signature' && typeof body[key] !== 'object') { signature = signature + body[key]; }
    }

    return crypto.createHash('sha256').update(`${signature}${process.env.ZEBRASMARKET_API_KEY}`).digest('hex');
}

const cashierCreditCreateTransaction = (body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8'
            };

            // Send create transaction request
            let response = await fetch(`https://api.zebrasmarket.com/partner/${process.env.ZEBRASMARKET_PARTNER}/trade_url`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.status === 200) {
                response = await response.json();
                resolve(response.data);
            } else {
                reject(new Error(`ERROR: ${response.statusText}`));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const cashierCreditCreateUrl = (url, amount) => {
    return new Promise(async(resolve, reject) => {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        try {
            await page.goto(url, { waitUntil: 'networkidle0' });

            await page.click('input[type="number"]', { clickCount: 3 });
            await page.keyboard.press('Backspace');

            await page.type('input[type="number"]', amount);
            await page.click('div.bg-pink-e6.hover');

            browser.on('targetcreated', async(target) => {
                if(target.type() === 'page') {
                    await browser.close();
                    resolve(target.url());
                }
            });

            const timeoutPromise = new Promise((_, reject) => { setTimeout(() => { resolve(url); }, 1000 * 10); });
            await Promise.race([timeoutPromise, new Promise(() => {})]);
        } catch(err) {
            await browser.close();
            reject(err);
        }
    });
}

module.exports = {
    cashierCheckSendCreditDepositData,
    cashierCreditCreateSignature,
    cashierCreditCreateTransaction,
    cashierCreditCreateUrl
}