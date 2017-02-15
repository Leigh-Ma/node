var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql');

/* GET city listing. */
function getCities(req, res, route) {
    var params = req.query;
    var city_name = params['city_name'];
    var user_id = params['creator_id'];
    var page = params['page'];
    var sql = '';

    if (!page) {
        page = 0;
    }

    if (city_name) {
        sql = "select * from cities where name = '" + city_name + "'";
    } else if (user_id){
        sql = "select * from cities where creater_id = " + user_id + " limit 10 offset " + page * 10;
    } else {
        sql = "select * from cities limit 10 offset " + page * 10;
    }

    var jade_res = {'/': 'cities/index', 'index': 'cities/_index'}[route]

    mysql.DB().query(sql, function(err, rows){
        if (err) throw err;
        res.render(jade_res,{cities: rows})
    });
}


router.get('/', function(req, res, next){
    getCities(req, res, '/')
});

router.get('/index', function(req, res, next){
    getCities(req, res, 'index')
});

module.exports = router;
