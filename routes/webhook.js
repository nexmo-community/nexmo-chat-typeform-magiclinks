var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
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
  console.log(token);
  console.log(req.protocol + '://' + req.get('host') + '/auth?token=' + token);

  // send webhook response
  res.sendStatus(200);
});

module.exports = router;
