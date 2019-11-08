var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
require('dotenv').config();

/* POST login webhook generates a magic link email to the provided email address */
router.post('/login', function(req, res, next) {
  // add user to users database if they're not there yet

  // generate JWT token for the magic link
  var token = jwt.sign({ email: req.body.email }, process.env.SECRET);

  // email token in magic link
  console.log(token);
  console.log(req.protocol, req.get('host'), req.originalUrl);
  console.log(req.protocol + '://' + req.get('host') + '/auth?token=' + token);

  // send webhook response
  res.sendStatus(200);
});

module.exports = router;
