var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var mailer = require('nodemailer');
require('dotenv').config();
var nexmo = require('../util/nexmo');
var User = require('../models/user');

var emailToUsername = (email) => {
  return email.replace(/@/g, '_at_').replace(/\./g, '_dot_');
}

var sendEmail = (req, user) => {
  var token = jwt.sign(user.toObject(), process.env.SECRET);

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
      to: user.email,
      subject: 'Magic Link',
      text: 'Click to login: ' + magicLink,
      html: `<a href="${magicLink}">Click to Login</a>`
  };

  transporter.sendMail(mailOptions);
}

var handleErr = (err) => {
  console.log(err);
}

/* POST webhook generates a magic link email to the provided email address */
router.post('/magiclink', (req, res, next) => {
  // find answers from the typeform response
  let { answers } = req.body.form_response;

  const answer = answers
    .find(answer => process.env.FORM_FIELD_TYPE === answer.type && answer.field.ref === process.env.FORM_FIELD_REF);

  // it'll probably be an email
  const email = answer[process.env.FORM_FIELD_TYPE];
  
  // turn the email into a rudimentary username 
  const username = emailToUsername(email);

  User.findOne({ name: username }, (err, user) => {
    if (err) {
      handleErr(err);
      res.statusCode(500);
    }

    // if we can't find an existing user, prepare a new user document
    if (null === user) {
      user = new User({
        name: username,
        email: email,
        display_name: email,
        user_id: null
      });
    }

    if (null === user.user_id) {
      nexmo.users.create(user.toObject(), (err, nexmoUser) => {
        if (err) {
          handleErr(err);
          res.statusCode(500);
        }

        user.user_id = nexmoUser.id;
  
        nexmo.conversations.members.create(process.env.NEXMO_CONVERSATION_ID, {
          action: 'join',
          user_id: nexmoUser.id,
          channel: { type: 'app' }
        }, (err, member) => {
          if (err) {
            handleErr(err);
            res.statusCode(500);
          }

          user.member_id = member.id;

          user.save((err) => {
            if (err) {
              handleErr(err);
              res.statusCode(500);
            }
  
            sendEmail(req, user);
            res.sendStatus(200);
          });
        });
      });
    } else {
      sendEmail(req, user);
      res.sendStatus(200);
    }
  });
});

module.exports = router;
