var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql');

var lib   = require('../service/lib');

/* GET city listing. */

function queryCondition(params) {
    var condition = {where: '', limit: true};

    if (params.city_name) {
        condition.where = "where name = '" + params.city_name + "'";
        condition.limit = false;
    } else if (params.creator_id && params.myRole != 'root') {
        condition.where = "where create_user_id = " + params.creator_id;
    }
    return condition
}

function getCities(route, req, res) {
    var params = req.query;
    var view = {'/': 'cities/index', 'index': 'cities/_index'}[route];

    params.myRole = lib.currentUser(res).role;
    params.creator_id = lib.currentUser(res).id;
    
    console.log(JSON.stringify(params));

    mysql.pagination('cities', view, res, params, queryCondition);
}


router.get('/', function(req, res, next){
    getCities('/', req, res)
});

router.get('/index', function(req, res, next){
    getCities('index', req, res)
});

module.exports = router;
