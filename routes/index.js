var express = require('express');
var router = express.Router();
var mysql = require('../service/mysql')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/cities')
});

module.exports = router;
