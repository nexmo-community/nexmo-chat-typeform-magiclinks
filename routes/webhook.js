var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var mailer = require('nodemailer');
require('dotenv').config();

/* POST webhook generates a magic link email to the provided email address */
router.post('/magiclink', function(req, res, next) {
  let { answers } = req.body.form_response;

  const answer = answers
    .find(answer => 'email' === answer.type && answer.field.ref === process.env.FORM_FIELD_REF);

  const email = answer[process.env.FORM_FIELD_TYPE];

  // generate JWT token for the magic link
  var token = jwt.sign({ email: email }, process.env.SECRET);

  // email token in magic link
  var transporter = mailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
  });

  var magicLink = req.protocol + '://' + req.get('host') + '/auth?token=' + token;

  var mailOptions = {
      to: email,
      subject: 'Magic Link',
      text: 'Click to login: ' + magicLink,
      html: `<a href="${magicLink}">Click to Login</a>`
  };

  transporter.sendMail(mailOptions);

  // send webhook response
  res.sendStatus(200);
});

module.exports = router;
