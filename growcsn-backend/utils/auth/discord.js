const fetch = require('node-fetch');
const url = require('url');

const authGetDiscordToken = (code) => {
    return new Promise(async(resolve, reject) => {
        try {
            let response = await fetch('https://discordapp.com/api/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new url.URLSearchParams({
                    'client_id': process.env.DISCORD_CLIENT_ID,
                    'client_secret': process.env.DISCORD_CLIENT_SECRET,
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': `${process.env.SERVER_BACKEND_URL}/auth/discord/callback`,
                    'scope': 'identify'
                })
            });

            // Validate response object
            if(response !== undefined && response !== null && response.status === 200) {
                response = await response.json();
                resolve(response.access_token);
            } else { reject(new Error('We are not able to fetch your discord user data at the moment. Please try again later.')); }
        } catch(err) {
            reject(new Error('Something went wrong. Please try again in a few seconds.'));
        }
    });
}

module.exports = {
    authGetDiscordToken
}