var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'xxxxxxx',
    auth: {
        user: 'xxxxxxxxxxxxxxxx',
        pass: 'xxxxxxxxxxxxxxxx'
    }
});
module.exports = transporter;