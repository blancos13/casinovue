const fetch = require('node-fetch');

const cashierCheckSendSteamDepositData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.game === undefined || typeof data.game !== 'string' || ['csgo', 'dota2'].includes(data.game) !== true) {
        throw new Error('Your provided game is invalid.');
    }
}

const cashierSteamCreateTransaction = (body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create headers object
            let headers = {
                'Token': process.env.SKINIFY_API_KEY
            };

            // Send create transaction request
            let response = await fetch('https://skinify.io/api/create-deposit', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.status === 200) {
                response = await response.json();
                resolve(response);
            } else {
                reject(new Error(`ERROR: ${response.statusText}`));
            }
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    cashierCheckSendSteamDepositData,
    cashierSteamCreateTransaction
}