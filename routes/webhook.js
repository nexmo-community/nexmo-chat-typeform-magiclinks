var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var mailer = require('nodemailer');
require('dotenv').config();

/* POST webhook generates a magic link email to the provided email address */
router.post('/magiclink', function(req, res, next) {
  let { answers } = req.body.form_response;

  let answer = answers
    .filter(function (answer) {
      return process.env.FORM_FIELD_TYPE === answer.type
        && answer.field.ref === process.env.FORM_FIELD_REF
        ;
    })
    .map(function(answer) {
      var field = answer.type;
      return answer[field]
    })
    [0];

  console.log(answer);

  // add user to users database if they're not there yet
  

  // generate JWT token for the magic link
  var token = jwt.sign({ email: answer }, process.env.SECRET);

  // email token in magic link
  var transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        // should be replaced with real sender's account
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
    }
  });
  let mailOptions = {
      // should be replaced with real recipient's account
      to: 'info@gmail.com',
      subject: req.body.subject,
      body: req.body.message
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });

  // logging
  console.log(token);
  console.log(req.protocol + '://' + req.get('host') + '/auth?token=' + token);

  // send webhook response
  res.sendStatus(200);
});

module.exports = router;
