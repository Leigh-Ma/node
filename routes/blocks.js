var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql')

/* GET city listing. */

function queryCondition(params) {
    if (params['name']) {
        return {
            where: "where name = '" + params['name'] + "'",
            limit: false
        }
    }

    if (params['city_name']) {
        return {
            where: "where city_name = '" + params['city_name'] + "'",
            limit: true
        }
    }

    if (params['user_id']) {
        return {
            where: "where user_id = " + params['user_id'],
            limit: true
        }
    }

    return {where: '', limit: true}
}

function getBlocks(req, res, route) {
    var view = {'/': 'blocks/index', 'index': 'blocks/_index'}[route];
    var params = req.query;
    
    console.log(JSON.stringify(params));
    
    mysql.pagination('blocks', view, res, params, queryCondition);
}

router.get('/', function(req, res, next){
    getBlocks(req, res, '/')
});

router.get('/index', function(req, res, next){
    getBlocks(req, res, 'index')
});

module.exports = router;
