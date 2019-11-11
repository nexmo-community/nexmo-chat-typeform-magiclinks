var express = require('express');
var router = express.Router();
require('dotenv').config();
var nexmo = require('../util/nexmo');

var isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
  } else{
    res.redirect(process.env.FORM_URL);
  }
}

/* GET home */
router.get('/', isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/jwt', isAuthenticated, (req, res, next) => {
  const aclPaths = {
    "paths": {
      "/*/users/**": {},
      "/*/conversations/**": {},
      "/*/sessions/**": {},
      "/*/devices/**": {},
      "/*/image/**": {},
      "/*/media/**": {},
      "/*/applications/**": {},
      "/*/push/**": {},
      "/*/knocking/**": {}
    }
  };

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 1);

  const jwt = nexmo.generateJwt({
    application_id: process.env.NEXMO_APP_ID,
    sub: req.user.name,
    exp: Math.round(expires_at/1000),
    acl: aclPaths
  });

  res.json({
    user_id: req.user.user_id,
    name: req.user.name,
    member_id: req.user.member_id,
    display_name: req.user.display_name,
    client_token: jwt,
    expires_at: expires_at
  });
})

module.exports = router;
