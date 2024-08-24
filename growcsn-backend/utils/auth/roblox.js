const mongoose = require('mongoose');
const crypto = require('crypto');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const validator = require('validator');
const HttpsProxyAgent = require('https-proxy-agent');

// Load database models
const User = require('../../database/models/User');
const UserSeed = require('../../database/models/UserSeed');
const Report = require('../../database/models/Report');

const authCheckPostRobloxData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.username === undefined || typeof data.username !== 'string') {
        throw new Error('Your provided username is invalid.');
    } else if(data.password === undefined || typeof data.password !== 'string') {
        throw new Error('Your provided password is invalid.');
    }
}

const authCheckPostRobloxUser = (user, userRoblox) => {
    if(user.roblox !== undefined) {
        throw new Error('Your user have already a linked roblox account.');
    } else if(userRoblox !== null) {
        throw new Error('Your roblox account was already linked by an other user.');
    }
}

const authCheckPostRobloxTwoStepData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.ticket === undefined || typeof data.ticket !== 'string') {
        throw new Error('Your provided ticket is invalid.');
    } else if(data.code === undefined || typeof data.code !== 'string') {
        throw new Error('Your provided code is invalid.');
    }
} 

const authCheckPostRobloxTwoStepUser = (user, userRoblox) => {
    if(user.roblox !== undefined) {
        throw new Error('Your user have already a linked roblox account.');
    } else if(userRoblox !== null) {
        throw new Error('Your roblox account was already linked by an other user.');
    }
}

const authCheckPostRobloxCookieData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.cookie === undefined || data.cookie === null || typeof data.cookie !== 'string' || data.cookie.startsWith('_|WARNING:') === false) {
        throw new Error('Your provided .ROBLOSECURITY cookie is invalid.');
    }
}

const authCheckPostRobloxCookieUser = (user, userRoblox) => {
    if(user.roblox !== undefined) {
        throw new Error('Your user have already a linked roblox account.');
    } else if(userRoblox !== null) {
        throw new Error('Your roblox account was already linked by an other user.');
    }
}

const authRobloxToBuffer = (e) =>  {
    for (var t = new Uint8Array(e.length), n = 0; n < e.length; n++)
        t[n] = e.charCodeAt(n);
    return t.buffer;
}

const authRobloxToBase = (e) => {
    for (var t = "", n = new Uint8Array(e), r = 0; r < n.byteLength; r++)
        t += String.fromCharCode(n[r]);
    return btoa(t);
}

const authSetUser = (proxy, userIp, cookieRoblox, userRoblox, userAge, userAvatar) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get user object from database if exists
            let userDatabase = await User.findOne({ 'roblox.id': userRoblox.id }).select('roblox ips').lean();

            if(userDatabase === null) {
                // Generate random user client seeds
                const seedsClient = [
                    crypto.randomBytes(8).toString('hex'), 
                    crypto.randomBytes(8).toString('hex')
                ];

                // Generate new user server seeds
                const seedsServer = [
                    crypto.randomBytes(24).toString('hex'), 
                    crypto.randomBytes(24).toString('hex')
                ];

                // Hash new generated user server seeds
                const hashes = [
                    crypto.createHash('sha256').update(seedsServer[0]).digest('hex'), 
                    crypto.createHash('sha256').update(seedsServer[1]).digest('hex')
                ];

                // Generate user id
                const userId = new mongoose.Types.ObjectId();

                // Create user, user seeds and update reports in database
                const dataDatabase = await Promise.all([
                    User.create({
                        _id: userId,
                        roblox: {
                            id: userRoblox.id,
                            cookie: cookieRoblox,
                            createdAt: new Date(userAge).getTime()
                        },
                        username: validator.escape(userRoblox.name),
                        avatar: userAvatar,
                        proxy: proxy,
                        ips: [{ address: userIp }]
                    }),
                    Report.findOneAndUpdate({ createdAt: new Date().toISOString().slice(0, 10) }, {
                        $inc: {
                            'stats.total.user': 1
                        }
                    }, { upsert: true }),
                    UserSeed.create({
                        seedClient: seedsClient[0],
                        seedServer: seedsServer[0],
                        hash: hashes[0],
                        nonce: 1,
                        user: userId,
                        state: 'active'
                    }),
                    UserSeed.create({
                        seedClient: seedsClient[1],
                        seedServer: seedsServer[1],
                        hash: hashes[1],
                        nonce: 1,
                        user: userId,
                        state: 'created'
                    })
                ]);

                // Convert mongoose object to javascript object
                userDatabase = dataDatabase[0].toObject();
            } else {
                // Get user ips array
                userDatabase.ips = userDatabase.ips || [];

                // Add user ip to users ip array
                userDatabase.ips.unshift({ address: userIp });

                // Update user in database
                userDatabase = await User.findOneAndUpdate({ 'roblox.id': userRoblox.id }, {
                    'roblox.cookie': cookieRoblox,
                    'roblox.createdAt': new Date(userAge).getTime(),
                    username: validator.escape(userRoblox.name),
                    avatar: userAvatar,
                    proxy: proxy,
                    ips: userDatabase.ips.slice(0, 25),
                    updatedAt: new Date().getTime()
                }, { new: true }).select('local roblox.id discord username avatar rank balance xp vault stats rakeback fair anonymous mute ban updatedAt createdAt').lean();
            }

            // Format user object
            userDatabase = {
                _id: userDatabase._id,
                local: userDatabase.local,
                roblox: { id: userDatabase.roblox.id },
                discord: userDatabase.discord,
                username: userDatabase.username,
                avatar: userDatabase.avatar,
                rank: userDatabase.rank,
                balance: userDatabase.balance,
                xp: userDatabase.xp,
                vault: userDatabase.vault,
                stats: userDatabase.stats,
                rakeback: userDatabase.rakeback,
                fair: userDatabase.fair,
                anonymous: userDatabase.anonymous,
                mute: userDatabase.mute,
                ban: userDatabase.ban,
                updatedAt: userDatabase.updatedAt,
                createdAt: userDatabase.createdAt
            };

            resolve(userDatabase);
        } catch(err) {
            reject(new Error('Something went wrong. Please try again in a few seconds.'));
        }
    });
}

const authRobloxGetIntent = (serverNonceData) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Generate auth intent key pair
            const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);

            // Get intent time
            const time = Math.floor(new Date().getTime() / 1e3);
            
            // Get intent signature
            const signature = authRobloxToBase(await crypto.subtle.sign(
                { name: 'ECDSA', hash: { name: 'SHA-256' } }, 
                keyPair.privateKey, 
                authRobloxToBuffer([authRobloxToBase(await crypto.subtle.exportKey('spki', keyPair.publicKey)), time, serverNonceData].join('|'))
            ));

            resolve({ 
                clientEpochTimestamp: time, 
                clientPublicKey: authRobloxToBase(await crypto.subtle.exportKey('spki', keyPair.publicKey)),
                saiSignature: signature,
                serverNonce: serverNonceData
            });
        } catch(err) {
            reject(new Error('Something went wrong. Please try again in a few seconds.'));
        }
    });
}

const authRobloxGetToken = (proxy, robloxCookie) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Get csrf token from roblox api
            let response = await fetch('https://roblox.com', { agent: proxyAgent, headers: headers });

            // Check if the response is successful
            if(response.ok) {
                response = await response.text();
                const html = cheerio.load(response);
                resolve(html('meta[name="csrf-token"]').attr('data-token'));
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authRobloxGetUser = (proxy, robloxCookie) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create header object
            let headers = {
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get roblox user from roblox user api
            let response = await fetch('https://users.roblox.com/v1/users/authenticated', { agent: proxyAgent, headers: headers });

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

const authRobloxGetUserAge = (proxy, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Send get roblox user from roblox user api
            let response = await fetch(`https://users.roblox.com/v1/users/${userId}`, { agent: proxyAgent });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response.created);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authRobloxGetAvatar = (proxy, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Send get roblox user avatar from roblox user api
            let response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=100x100&format=Png&isCircular=false`, { agent: proxyAgent });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response.data[0].imageUrl);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authRobloxGetServerNonce = (proxy) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Send get roblox user avatar from roblox user api
            let response = await fetch('https://apis.roblox.com/hba-service/v1/getServerNonce', { agent: proxyAgent });

            // Check if the response is successful
            if(response.ok) {
                response = await response.text();
                resolve(response.replaceAll('"', ''));
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authGetRobloxSecurityQuestion = (token, proxy, userId, sessionId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'x-csrf-token': token
            };

            // Send get roblox security question from roblox api
            let response = await fetch(`https://apis.roblox.com/account-security-service/v1/security-question?userId=${userId}&sessionId=${sessionId}`, { agent: proxyAgent, headers: headers });

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

const authGetRobloxGamesData = (token, proxy, games) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'x-csrf-token': token
            };

            // Send get roblox games data from roblox games api
            let response = await fetch(`https://games.roblox.com/v1/games?universeIds=${games.join(',')}`, { agent: proxyAgent, headers: headers });

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

const authGetRobloxTwoStepType = (token, proxy, robloxCookie, robloxId, twoStepId) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'x-csrf-token': token,
                'cookie': `.ROBLOSECURITY=${robloxCookie}`
            };

            // Send get roblox twostep data from roblox twostepverification api
            let response = await fetch(`https://twostepverification.roblox.com/v1/users/${robloxId}/configuration?challengeId=${twoStepId}`, { agent: proxyAgent, headers: headers });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response.primaryMediaType);
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authSendRobloxChallengeContinue = (proxy, token, robloxCookie, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token
            };

            // Add roblox cookie to headers object if available
            if(robloxCookie !== null) { headers['cookie'] = robloxCookie; }

            // Send challengen continue to roblox api
            let response = await fetch('https://apis.roblox.com/challenge/v1/continue', { 
                method: 'POST', 
                agent: proxyAgent, 
                headers: headers, 
                body: JSON.stringify(body)
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

const authSendRobloxSecurityAnswer = (token, proxy, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token
            };

            // Send post twostep verify request to roblox auth api
            let response = await fetch('https://apis.roblox.com/account-security-service/v1/security-question', { 
                method: 'POST', 
                agent: proxyAgent, 
                headers: headers, 
                body: JSON.stringify(body) 
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve({ securityQuestionRedemptionToken: response.securityQuestionRedemptionToken });
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authSendRobloxTwoStepVerify = (proxy, token, robloxCookie, robloxId, type, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create roblox two step url
            const url = type === 'Authenticator' ?
                            `https://twostepverification.roblox.com/v1/users/${robloxId}/challenges/authenticator/verify` :
                            `https://twostepverification.roblox.com/v1/users/${robloxId}/challenges/email/verify`;

            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token
            };

            // Add roblox cookie to headers object if available
            if(robloxCookie !== null) { headers['cookie'] = robloxCookie; }

            // Send post twostep verify request to roblox auth api
            let response = await fetch(url, { 
                method: 'POST', 
                agent: proxyAgent, 
                headers: headers, 
                body: JSON.stringify(body) 
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve({ verificationToken: response.verificationToken });
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authSendRobloxLogin = (req, token, proxy, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*', 
                'Sec-Fetch-Site': 'same-site', 
                'Sec-Fetch-Mode': 'cors', 
                'Sec-Fetch-Dest': 'empty', 
                'Accept-Encoding': 'gzip, deflate, br',
                'x-csrf-token': token,
                'Sec-Ch-Ua': req.headers['sec-ch-ua'] || `"Not?A_Brand";v="8", "Chromium";v="108"`,
                'Sec-Ch-Ua-Mobile': req.headers['sec-ch-ua-mobile'] || "?0", 
                'Sec-Ch-Ua-Platform': req.headers['sec-ch-ua-platform'] || `"Windows"`, 
                'User-Agent': req.headers['user-agent'],
                'Origin': req.headers['origin'],
                'Referer': req.headers['referer'],
                'Accept-Language': req.headers['accept-language']
            };

            if(body.challengeId !== undefined) {
                headers['Rblx-Challenge-Id'] = body.challengeId;
                headers['Rblx-Challenge-Metadata'] = btoa(JSON.stringify({ unifiedCaptchaId: body.captchaId, captchaToken: body.captchaToken, actionType: 'Login' }));
                headers['Rblx-Challenge-Type'] = 'captcha';
            }

            // Send post login request to roblox auth api
            let response = await fetch('https://auth.roblox.com/v2/login', {  
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

            // Check if the response is successful
            if(response.headers.get('set-cookie') !== null && response.headers.get('set-cookie').includes('.ROBLOSECURITY=') === true) {
                let cookie = response.headers.get('set-cookie').split(';').find((element) => element.search('.ROBLOSECURITY=') !== -1);
                cookie = cookie.replace('path=/, .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_', '').trim();

                resolve({ cookie: cookie });
            } else if(response.headers.get('rblx-challenge-metadata') !== null) {
                const data = JSON.parse(atob(response.headers.get('rblx-challenge-metadata')));
                resolve({ challengeId: response.headers.get('rblx-challenge-id'), captchaId: data.unifiedCaptchaId, captchaBlob: data.dataExchangeBlob, secureAuthenticationIntent: body.secureAuthenticationIntent });
            } else {
                response = await response.json();

                if(response.twoStepVerificationData !== undefined) {
                    resolve(response);
                }else if(response.errors !== undefined && response.errors[0].code === 18) {
                    reject(new Error('Something went wrong. Please try to login with your roblox cookie.'));
                    /*
                    const data = JSON.parse(response.errors[0].fieldData);
                    resolve({ userId: data.userId, sessionId: data.sessionId });
                    */
                } else if(response.errors !== undefined) {
                    reject(new Error(response.errors[0].message));
                } else {
                    reject(new Error('Something went wrong. Please try again in a few seconds.'));
                }
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authSendRobloxTwoStepLogin = (token, proxy, robloxId, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                'content-type': 'application/json;charset=UTF-8',
                'x-csrf-token': token
            };

            // Send twostep login request to roblox auth api
            let response = await fetch(`https://auth.roblox.com/v3/users/${robloxId}/two-step-verification/login`, {  
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: JSON.stringify(body)
            });

             // Check if the response is successful
             if(response.ok) {
                let cookie = response.headers.get('set-cookie').split(';').find((element) => element.search('.ROBLOSECURITY=') !== -1);
                cookie = cookie.replace('path=/, .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_', '').trim();

                resolve({ cookie: cookie });
            } else {
                reject(new Error(response.statusText));
            }
        } catch(err) {
            reject(err);
        }
    });
}

const authRobloxSendSecurityEnable = (proxy, token, robloxCookie, userId, body) => {
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

            // Add challenge info to header
            if(body.challengeId !== undefined) {
                headers['rblx-challenge-id'] = body.challengeId;
                headers['rblx-challenge-metadata'] = btoa(JSON.stringify({ actionType: 'Generic', challengeId: body.twoStepId, verificationToken: body.verificationToken, rememberDevice: false }));
                headers['rblx-challenge-type'] = 'twostepverification';
            }

            // Send generate two step challenge request
            let response = await fetch(`https://twostepverification.roblox.com/v1/users/${userId}/configuration/security-key/enable`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response);
            } else if(response.status === 403 && response.headers.get('rblx-challenge-metadata') !== null) {
                const data = JSON.parse(atob(response.headers.get('rblx-challenge-metadata')));
                resolve({ challengeId: response.headers.get('rblx-challenge-id'), twoStepId: data.challengeId });
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

const authRobloxSendSecurityEnableVerify = (proxy, token, robloxCookie, userId, challengeId, verificationToken) => {
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

            // Add challenge info to header
            if(challengeId !== undefined) {
                headers['rblx-challenge-id'] = challengeId;
                headers['rblx-challenge-metadata'] = btoa(JSON.stringify({ challengeId: challengeId, verificationToken: verificationToken, rememberDevice: false, actionType: 'Generic' }));
                headers['rblx-challenge-type'] = 'twostepverification';
            }

            // Send generate two step challenge request
            let response = await fetch(`https://twostepverification.roblox.com/v1/users/${userId}/configuration/security-key/enable`, {
                method: 'POST',
                agent: proxyAgent,
                headers: headers
            });

            // Check if the response is successful
            if(response.ok) {
                response = await response.json();
                resolve(response);
            } else if(response.status === 403 && response.headers.get('rblx-challenge-metadata') !== null) {
                const data = JSON.parse(atob(response.headers.get('rblx-challenge-metadata')));
                resolve({ challengeId: data.challengeId });
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

module.exports = {
    authCheckPostRobloxData,
    authCheckPostRobloxUser,
    authCheckPostRobloxTwoStepData,
    authCheckPostRobloxTwoStepUser,
    authCheckPostRobloxCookieData,
    authCheckPostRobloxCookieUser,
    authSetUser,
    authRobloxGetIntent,
    authRobloxGetToken,
    authRobloxGetUser,
    authRobloxGetUserAge,
    authRobloxGetAvatar,
    authRobloxGetServerNonce,
    authGetRobloxSecurityQuestion,
    authGetRobloxGamesData,
    authGetRobloxTwoStepType,
    authSendRobloxChallengeContinue,
    authSendRobloxSecurityAnswer,
    authSendRobloxTwoStepVerify,
    authSendRobloxLogin,
    authSendRobloxTwoStepLogin,
    authRobloxSendSecurityEnable,
    authRobloxSendSecurityEnableVerify
}