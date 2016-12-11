var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/temp', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
