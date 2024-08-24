const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const router = express.Router();

// Load database models
const User = require('../../../database/models/User');
const UserSeed = require('../../../database/models/UserSeed');
const Token = require('../../../database/models/Token');
const Report = require('../../../database/models/Report');

// Load middleware
const {
    authorizeUser
} = require('../../../middleware/auth');
const {
    rateLimiterStrictMiddleware
} = require('../../../middleware/rateLimiter');

// Load utils
const {
    captchaCheckData,
    captchaGetData
} = require('../../../utils/captcha');
const {
    emailSend
} = require('../../../utils/email');
const {
    authGenerateJwtToken,
} = require('../../../utils/auth');
const {
    authCheckPostCredentialsData,
    authCheckPostCredentialsUser,
    authCheckPostCredentialsRegisterData,
    authCheckPostCredentialsRegisterUser,
    authCheckPostCredentialsusernameRegisterUser,
    authCheckPostCredentialsLinkData,
    authCheckPostCredentialsLinkUser,
    authCheckPostCredentialsRequestData,
    authCheckPostCredentialsRequestUser,
    authCheckPostCredentialsRequestToken,
    authCheckPostCredentialsVerifyData,
    authCheckPostCredentialsVerifyToken,
    authCheckPostCredentialsResetData,
    authCheckPostCredentialsResetToken
} = require('../../../utils/auth/credentials');

module.exports = () => {

    // @desc    Login user
    // @route   POST /auth/credentials
    // @access  Public
    router.post('/', rateLimiterStrictMiddleware, async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsData(req.body);

            // Validate captcha
            const captchaCheck = await captchaGetData(req.body.captcha);
            captchaCheckData(captchaCheck);

            // Get sent email and password

            const email = req.body.email.trim();
            const password = req.body.password.trim();

            // Get user from database
            let userDatabase = await User.findOne({ 'local.email': email }).select('local ips').lean();

            // Compare password
            const isMatch = await bcrypt.compare(password, (userDatabase !== null && userDatabase.local !== undefined ? userDatabase.local.password : ''));

            // Validate user
            authCheckPostCredentialsUser(userDatabase, isMatch);

            // Get user ip address
            const userIp = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;

            // Get user ips array
            userDatabase.ips = userDatabase.ips || [];

            // Add user ip to users ip array
            userDatabase.ips.unshift({ address: userIp });

            // Update user in database
            userDatabase = await User.findByIdAndUpdate(userDatabase._id, { 
                ips: userDatabase.ips.slice(0, 25), 
                updatedAt: new Date().getTime() 
            }).select('local.email local.emailVerified roblox.id discord.id username avatar rank balance xp vault stats rakeback fair anonymous mute ban verifiedAt updatedAt createdAt').lean();

            // Generate access token
            const accessToken = authGenerateJwtToken(userDatabase._id);

            res.status(200).json({ success: true, token: accessToken, user: userDatabase });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Register user
    // @route   POST /auth/credentials/register
    // @access  Public
    router.post('/register', rateLimiterStrictMiddleware, async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsRegisterData(req.body);

            // Validate captcha
            const captchaCheck = await captchaGetData(req.body.captcha);
            captchaCheckData(captchaCheck);

            const username = req.body.username.trim();
            const email = req.body.email.trim();
            let password = req.body.password.trim();

            // Get user from database
            const usernamebase = await User.findOne({ 'local.username': username }).select('local').lean();

            // Validate user
            authCheckPostCredentialsusernameRegisterUser(usernamebase);

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

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

            // Get user ip address
            const userIp = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;

            // Get random username

            // Generate user id
            const userId = new mongoose.Types.ObjectId();

            // Create user, user seeds and update reports in database

            // create random avatar
            let avatarNum = Math.floor(Math.random() * 9) + 1;           
            //
            let dataDatabase = await Promise.all([
                User.create({
                    _id: userId,
                    username: req.body.username,
                    local: {
                        email: req.body.email,
                        password: password
                    },
                    ips: [{ address: userIp }],
                    avatar: `/public/img/avatar/${avatarNum}.webp`
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

            // Convert user object to javascript object
            dataDatabase[0] = dataDatabase[0].toObject();

            // Sanitze user object
            delete dataDatabase[0].local.password;

            // Generate access token
            const accessToken = authGenerateJwtToken(dataDatabase[0]._id);

            res.status(200).json({ success: true, token: accessToken, user: dataDatabase[0] });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Link user
    // @route   POST /auth/credentials/link
    // @access  Private
    router.post('/link', [rateLimiterStrictMiddleware, authorizeUser(true)], async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsLinkData(req.body);

            // Get sent email and password
            const email = req.body.email.trim();
            let password = req.body.password.trim();

            // Get user from database
            let dataDatabase = await Promise.all([
                User.findById(req.user._id).select('local').lean(),
                User.findOne({ 'local.email': email }).select('local').lean()
            ]);

            // Validate user
            authCheckPostCredentialsLinkUser(dataDatabase);

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            // Update user in database
            dataDatabase = await User.findByIdAndUpdate(req.user._id, {
                local: {
                    email: req.body.email,
                    password: password
                }
            }, { new: true }).select('local.email local.emailVerified').lean();

            res.status(200).json({ success: true, user: dataDatabase });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Request verify user or reset password email
    // @route   POST /auth/credentials/request
    // @access  Public
    router.post('/request', rateLimiterStrictMiddleware, async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsRequestData(req.body);

            // Get user from the database
            const userDatabase = await User.findOne({ 'local.email': req.body.email }).select('local').lean();

            // Validate user
            authCheckPostCredentialsRequestUser(userDatabase, req.body);

            // Get token from the database
            const tokenDatabase = await Token.findOne({ type: req.body.type, user: userDatabase._id }).select('type user updatedAt').lean();

            // Validate token
            authCheckPostCredentialsRequestToken(tokenDatabase);

            // Create a new token  
            const token = crypto.randomBytes(16).toString('hex');

            // Create or update token in the database
            await Token.findOneAndUpdate({ type: req.body.type, user: userDatabase._id }, { token: token, updatedAt: new Date() }, { upsert: true })

            // Create mail message
            const message = req.body.type === 'verify' ?
                `Please verify your e-mail address on ${process.env.SERVER_FRONTEND_URL.split(',')[0]} by clicking on the following link: \n\n${process.env.SERVER_FRONTEND_URL.split(',')[0]}/verify?userId=${userDatabase._id}&token=${token}` :
                `Please reset your password on ${process.env.SERVER_FRONTEND_URL.split(',')[0]} by clicking on the following link: \n\n${process.env.SERVER_FRONTEND_URL.split(',')[0]}/reset?userId=${userDatabase._id}&token=${token}`;

            // Send email to user
            await emailSend(userDatabase.local.email, (req.body.type === 'verify' ? 'Verify your e-mail address.' : 'Reset your password.'), message);

            res.status(200).json({ success: true });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Verify user email
    // @route   POST /auth/credentials/verify
    // @access  Public
    router.post('/verify', rateLimiterStrictMiddleware, async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsVerifyData(req.body);

            // Get token from database
            const tokenDatabase = await Token.findOne({ token: req.body.token, type: 'verify', user: req.body.userId }).select('token type user updatedAt').lean();

            // Validate token
            authCheckPostCredentialsVerifyToken(tokenDatabase);

            // Delete token and update user in the database
            await Promise.all([
                Token.findByIdAndDelete(tokenDatabase._id),
                User.findByIdAndUpdate(tokenDatabase.user, { 'local.emailVerified': true }, {})
            ]);

            res.status(200).json({ success: true });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    // @desc    Reset user password
    // @route   POST /auth/credentials/reset
    // @access  Public
    router.post('/reset', rateLimiterStrictMiddleware, async(req, res) => {
        try {
            // Validate sent data
            authCheckPostCredentialsResetData(req.body);

            // Validate captcha
            const captchaCheck = await captchaGetData(req.body.captcha);
            captchaCheckData(captchaCheck);

            // Get token from database
            const tokenDatabase = await Token.findOne({ token: req.body.token, type: 'reset', user: req.body.userId }).select('token type user updatedAt').lean();

            // Validate token
            authCheckPostCredentialsResetToken(tokenDatabase);

            // Get sent password
            let password = req.body.password.trim();

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            // Delete token and update user in the database
            await Promise.all([
                Token.findByIdAndDelete(tokenDatabase._id),
                User.findByIdAndUpdate(tokenDatabase.user, { 'local.password': password }, {})
            ]);

            res.status(200).json({ success: true });
        } catch(err) {
            res.status(500).json({ success: false, error: { type: 'error', message: err.message } });
        }
    });

    return router;

}