const validator = require('validator');

const authCheckPostCredentialsData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your provided captcha token is invalid.');
    } else if(data.password === undefined || typeof data.password !== 'string' || data.password.length <= 4) {
        throw new Error('Your provided password is invalid.');
    }
}

const authCheckPostCredentialsUser = (userDatabase, isMatch) => {
    if(userDatabase === null || isMatch !== true) {
        throw new Error('Your provided credentials are invalid.');
    }
}

const authCheckPostCredentialsRegisterData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your provided captcha token is invalid.');
    } else if(data.email === undefined || typeof data.email !== 'string' || validator.isEmail(data.email) !== true) {
        throw new Error('Your provided email is invalid.');
    } else if(data.password === undefined || typeof data.password !== 'string' || data.password.length <= 4 || data.password.length > 128) {
        throw new Error('Your provided password is invalid.');
    }
}

const authCheckPostCredentialsRegisterUser = (userDatabase) => {
    if(userDatabase !== null) {
        throw new Error('Your provided email is already used.');
    }
}
const authCheckPostCredentialsusernameRegisterUser = (usernamebase) => {
}

const authCheckPostCredentialsLinkData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.email === undefined || typeof data.email !== 'string' || validator.isEmail(data.email) !== true) {
        throw new Error('Your provided email is invalid.');
    } else if(data.password === undefined || typeof data.password !== 'string' || data.password.length <= 4 || data.password.length > 128) {
        throw new Error('Your provided password is invalid.');
    }
}

const authCheckPostCredentialsLinkUser = (dataDatabase) => {
    if(dataDatabase[0].local !== undefined) {
        throw new Error('Your account has already linked an email.');
    } else if(dataDatabase[1] !== null) {
        throw new Error('Your provided email is already used.');
    }
}

const authCheckPostCredentialsRequestData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.type === undefined || typeof data.type !== 'string' || ['verify', 'reset'].includes(data.type) !== true) {
        throw new Error('Your provided type is invalid.');
    } else if(data.email === undefined || typeof data.email !== 'string' || validator.isEmail(data.email) !== true) {
        throw new Error('Your provided email is invalid.');
    }
}

const authCheckPostCredentialsRequestUser = (userDatabase, data) => {
    if(userDatabase === null) {
        throw new Error('Your provided email is invalid.');
    } else if(data.type === 'verify' && userDatabase.local.emailVerified === true) {
        throw new Error('Your provided user is already verified.');
    }
}

const authCheckPostCredentialsRequestToken = (tokenDatabase) => {
    if(tokenDatabase !== null && (new Date().getTime() - new Date(tokenDatabase.updatedAt).getTime()) < 1000 * 60 * 5) {
        throw new Error('You need to wait at least 5 minutes before you can request a new email.');
    }
}

const authCheckPostCredentialsVerifyData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.userId === undefined || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your provided user id is invalid.');
    } else if(data.token === undefined || typeof data.token !== 'string' || data.token.length > 50) {
        throw new Error('Your provided token is invalid.');
    }
}

const authCheckPostCredentialsVerifyToken = (tokenDatabase) => {
    if(tokenDatabase === null) {
        throw new Error('Your provided token is invalid.');
    } else if((new Date().getTime() - new Date().getTime()) >= 1000 * 60 * 30) {
        throw new Error('Your provided token is expired. Please request a new email.');
    }
}

const authCheckPostCredentialsResetData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.captcha === undefined || data.captcha === null || typeof data.captcha !== 'string') {
        throw new Error('Your provided captcha token is invalid.');
    } else if(data.userId === undefined || typeof data.userId !== 'string' || validator.isMongoId(data.userId) !== true) {
        throw new Error('Your provided user id is invalid.');
    } else if(data.token === undefined || typeof data.token !== 'string' || data.token.length > 50) {
        throw new Error('Your provided token is invalid.');
    } else if(data.password === undefined || typeof data.password !== 'string' || data.password.length <= 4 || data.password.length > 128) {
        throw new Error('Your provided password is invalid.');
    }
}

const authCheckPostCredentialsResetToken = (tokenDatabase) => {
    if(tokenDatabase === null) {
        throw new Error('Your provided token is invalid.');
    } else if((new Date().getTime() - new Date().getTime()) >= 1000 * 60 * 30) {
        throw new Error('Your provided token is expired. Please request a new email.');
    }
}

module.exports = {
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
}