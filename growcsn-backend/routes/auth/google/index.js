const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Load middleware
const {
    authorizeUser
} = require('../../../middleware/auth');
const {
    rateLimiterStrictMiddleware
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    authGetDiscordToken,
} = require('../../../utils/auth');

module.exports = () => {

    // @desc    Redirect to google auth page
    // @route   GET /auth/google
    // @access  Public
    router.get('/', async(req, res) => {
        try {
            res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=k${process.env.SERVER_BACKEND_URL}/auth/google/callback&response_type=code&scope=openid%20profile%20email`);
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Handle google auth callback
    // @route   GET /auth/google/callback
    // @access  Public
    router.get('/callback', async(req, res) => {
        try {
            
        } catch(err) {
            res.render('discord', { success: false, tokenDiscord: null });
        }
    });

    return router;

}