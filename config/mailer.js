var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'boucher.oli@gmail.com',
		pass: 'MSIGeForce560Ti'
	}
});
module.exports = transporter;