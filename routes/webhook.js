var express = require('express');
var router = express.Router();
require('dotenv').config();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nexmo = require('../util/nexmo');
var mailer = require('../util/mailer');

var createMagicLink = (req, payload) => {
  var token = jwt.sign(payload, process.env.SECRET);

  return `${req.protocol}://${req.get('host')}/auth?token=${token}`;
}

var sendEmail = (magicLink, email) => {
  var mailOptions = {
      to: email,
      subject: 'Magic Link',
      text: 'Click to login: ' + magicLink,
      html: `<a href="${magicLink}">Click to Login</a>`
  };

  mailer.sendMail(mailOptions);
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

  User.findOne({ name: email }, (err, user) => {
    if (err) {
      handleErr(err);
      res.statusCode(500);
    }

    // if we can't find an existing user, prepare a new user document
    if (null === user) {
      user = new User({
        name: email,
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

            sendEmail(createMagicLink(req, user.toObject()), user.email);

            res.sendStatus(200);
          });
        });
      });
    } else {
      sendEmail(createMagicLink(req, user.toObject()), user.email);

      res.sendStatus(200);
    }
  });
});

module.exports = router;