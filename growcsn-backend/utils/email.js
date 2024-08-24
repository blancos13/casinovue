const nodemailer = require('nodemailer');

// Create email transport
const emailTransporter = nodemailer.createTransport({ 
    host: process.env.EMAIL_SMTP_HOST, 
    port: process.env.EMAIL_SMTP_PORT, 
    auth: { user: process.env.EMAIL_SMTP_USER, pass: process.env.EMAIL_SMTP_PASSWORD } 
});

const emailSend = (to, subject, message) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Create mail options
            const options = {
                from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
                to: to,
                subject: subject,
                text: message
            };

            // Send mail
            await emailTransporter.sendMail(options);

            resolve();
        } catch(err) {
            reject(err)
        }
    });
}

module.exports = {
    emailSend
}
