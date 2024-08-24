const fetch = require('node-fetch');

const fairGetData = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await fetch(`https://eos.greymass.com/`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if(response !== undefined && response.status === 200) {
                const data = await response.json();
                resolve({ success: true, data: data });
            } else {
                reject();
            }
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    fairGetData
}
