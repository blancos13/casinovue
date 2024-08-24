const express = require('express');
const router = express.Router();

// Load middleware
const {
    rateLimiterStrictMiddleware
} = require('../../middleware/rateLimiter');

// Load utils
const {
    requestGetProxy
} = require('../../utils/request');
const {
    captchaGetDataRoblox
} = require('../../utils/captcha');

module.exports = () => {

    // @desc    Handle discord auth callback
    // @route   GET /captcha/iframe
    // @access  Public
    router.get('/iframe', async(req, res) => {
        try {
            res.render('captcha', {
                frontendUrl: process.env.SERVER_FRONTEND_URL.split(',')[0]
            });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Get roblox captcha
    // @route   POST /captcha/api/arkose/fc/gt2/public_key/476068BF-9607-4799-B53D-966BE98E2B81
    // @access  Public
    router.post('/api/arkose/fc/gt2/public_key/476068BF-9607-4799-B53D-966BE98E2B81', rateLimiterStrictMiddleware, async(req, res) => {
        try {
             // Get user ip address
             const userIp = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;

             // Get user location country
             const userLocation = req.headers['cf-ipcountry'] || 'XX';

            // Get proxy for user 
            const proxy = await requestGetProxy(userIp, userLocation);

            // Get proxy string
            const proxyString = `http://${proxy.username}:${proxy.password}@${proxy.proxy_address}:${proxy.port}`;

            // Create get captcha body object
            req.body.data.blob = req.body.data.blob.replaceAll(' ', '+');
            req.body.site = 'https://www.roblox.com';

            // Get captcha token from captcha api
            const dataCaptcha = await captchaGetDataRoblox(proxyString, req, req.body);

            res.send(dataCaptcha);
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });
    
    return router;
    
}