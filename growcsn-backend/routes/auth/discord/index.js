const express = require('express');
const router = express.Router();

// Load utils
const {
    authGetDiscordToken,
} = require('../../../utils/auth');

module.exports = () => {

    // @desc    Redirect to discord auth page
    // @route   GET /auth/discord
    // @access  Public
    router.get('/', async(req, res) => {
        try {
            res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.SERVER_BACKEND_URL}/auth/discord/callback&response_type=code&scope=identify%20guilds`);
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Handle discord auth callback
    // @route   GET /auth/discord/callback
    // @access  Public
    router.get('/callback', async(req, res) => {
        try {
            // Get discord code
            const code = req.query.code;

            // Get access token from discord api
            const tokenDiscord = await authGetDiscordToken(code);

            res.render('discord', {
                success: true,
                tokenDiscord: tokenDiscord
            });
        } catch(err) {
            res.render('discord', { success: false, tokenDiscord: null });
        }
    });

    return router;

}