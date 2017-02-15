var express = require('express');
var router = express.Router();
var mysql = require('../service/mysql')

/* GET home page. */
router.get('/', function(req, res, next) {
  mysql.DB().query('select * from cities limit 10', function(err, rows, fields){
    if (err) throw err;
    console.log("Load city num:", rows.length);
    res.render('cities/index', {cities: rows})
  });
});


module.exports = router;
