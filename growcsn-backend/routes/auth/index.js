const express = require('express');
const router = express.Router();

// Load database models
const User = require('../../database/models/User');

// Load middleware
const {
    authorizeUser
} = require('../../middleware/auth');
const {
    rateLimiterMiddleware
} = require('../../middleware/rateLimiter');

module.exports = () => {

    // @desc    Get authorized user
    // @route   GET /auth/me
    // @access  Private
    router.get('/me', [rateLimiterMiddleware, authorizeUser(true)], async(req, res) => {
        try {
            // Get user from database
            const userDatabase = await User.findById(req.user._id).select('local.email local.emailVerified roblox.id discord.id username avatar rank balance xp vault stats rakeback fair anonymous mute ban verifiedAt updatedAt createdAt').lean();
            
            res.status(200).json({ success: true, user: userDatabase });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // Mount credentials, roblox and discord routes
    router.use('/credentials', require('./credentials')());
    router.use('/roblox', require('./roblox')());
    router.use('/discord', require('./discord')());

    return router;

}
