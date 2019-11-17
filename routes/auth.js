var express = require('express');
var router = express.Router();

/* GET authenticate user with magic link and direct to home */
router.get('/', (req, res, next) => {
  res.redirect(req.protocol + '://' + req.get('host') + '/');
});

module.exports = router;