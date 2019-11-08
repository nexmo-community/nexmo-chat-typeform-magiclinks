var express = require('express');
var router = express.Router();
require('dotenv').config();

var isAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  } else{
    res.redirect(process.env.FORM_URL);
  }
}

/* GET home */
router.get('/', isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
