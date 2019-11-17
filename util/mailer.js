const Mailer = require('nodemailer');
require('dotenv').config();

let options = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS
  }
};

module.exports = Mailer.createTransport(options);