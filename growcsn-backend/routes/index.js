const express = require('express');
const router = express.Router();

module.exports = (io) => {
    router.get('/', (req, res) => {
        res.status(200).json({ success: true });
    });

    router.use('/captcha', require('./captcha')());
    router.use('/auth', require('./auth')());
    router.use('/callback', require('./callback')(io));

    return router;
}
