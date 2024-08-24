const fetch = require('node-fetch');
const qs = require('qs'); 
const HttpsProxyAgent = require('https-proxy-agent');

const captchaCheckData = (captchaCheck) => {
    if(captchaCheck === undefined || captchaCheck === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(captchaCheck.success !== true) {
        throw new Error('Your provided captcha token is invalid.');
    }
}

const captchaGetData = (captcha) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await fetch(`https://hcaptcha.com/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captcha}`, { method: 'POST' });

            if(response !== undefined && response.status === 200) {
                const data = await response.json();
                resolve(data);
            } else {
                resolve({ success: false });
            }
        } catch(err) {
            resolve({ success: false });
        }
    });
}

const captchaGetDataRoblox = (proxy, req, body) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create new proxy agent
            const proxyAgent = new HttpsProxyAgent(proxy);

            // Create headers object
            let headers = {
                "Sec-Ch-Ua": req.headers["sec-ch-ua"],
                "Sec-Ch-Ua-Mobile": req.headers["sec-ch-ua-mobile"], 
                "Sec-Ch-Ua-Platform": req.headers["sec-ch-ua-platform"], 
                "User-Agent": req.headers["user-agent"],
                "Accept": "*/*", 
                "Origin": "https://www.roblox.com", 
                "Sec-Fetch-Site": "cross-site", 
                "Sec-Fetch-Mode": "cors", 
                "Sec-Fetch-Dest": "empty", 
                "Referer": "https://www.roblox.com/", 
                "Accept-Encoding": "gzip, deflate", 
                "Accept-Language": req.headers["accept-language"],
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            };

            // Send get captcha token from captcha api
            let response = await fetch('https://client-api.arkoselabs.com/fc/gt2/public_key/476068BF-9607-4799-B53D-966BE98E2B81', {  
                method: 'POST',
                agent: proxyAgent,
                headers: headers,
                body: qs.stringify(body)
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

module.exports = {
    captchaCheckData,
    captchaGetData,
    captchaGetDataRoblox
}
