var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql')

/* GET city listing. */

function getBlocks(req, res, route) {
    var params = req.query;

    console.log(JSON.stringify(params));

    var city_name = params['city_name']
    var page = params['page']
    var condition = '';

    if (city_name != undefined) {
        condition = "where city_name = '" + city_name + "'";
    }

    if (page == undefined) {
        page = 0;
    }

    var jade_res = {'/': 'blocks/index', 'index': 'blocks/_index'}[route]

    mysql.DB().query("select * from blocks " + condition + " limit 20 offset ?", [page * 20],
        function(err, rows, fields){
            if (err) throw err;
            res.render(jade_res,{blocks: rows})
        });
}

router.get('/', function(req, res, next){
   getBlocks(req, res, '/')
});

router.get('/index', function(req, res, next){
    getBlocks(req, res, 'index')
});

module.exports = router;
