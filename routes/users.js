var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql');
var lib   = require('../service/lib');

router.get('/logout', function(req, res, next){
    delete req.session.user;
    delete res.locals.session;
    res.render('users/login',{notice:
        {message: 'You have logout successfully!'}
    });
});

router.get('/login', function(req, res, next) {
    res.render('users/login');
});

router.post('/login', function (req, res, next) {
    var params = req.body;
    var user = {email: params['email']||'', password: params['password']||''};
    var sql = "select * from users where email = '" + user.email + "' and password_digest = '" + user.password + "'";
    console.log(sql);
    mysql.DB().query(sql, function(err, rows, fields){
        if(err)throw err;

        if(rows.length > 0) {
            user = rows[0];
            delete user.password_digest;
            req.session.user = user;
            return res.redirect('/');
        }

        res.render('users/login', {notice:
            {message: 'invalid name or password'}
        })
    });

});

router.get('/me', function(req, res, next){
    req.query.user_id = lib.currentUser(res).id;
    getUsers('/me', req, res)
});

router.get('/', function(req, res, next){
    getUsers('/', req, res)
});

router.get('/index', function(req, res, next){
    getUsers('/index', req, res)
});

module.exports = router;

function queryCondition(params) {
    var condition = {where:''};
    var more = ' and ';

    if(params.user_id) {
        condition.where = "where id = " + params.user_id;
        condition.limit = false;
        return condition;
    }

    if (params.myRole != 'root') {
        condition.where = "where creater_id = " + params.creator_id;
    } else {
        more = ' where ';
    }

    if (params.email) {
        condition.where = condition.where + more + "email like '" + params.email + "%'";
    } else if (params.role) {
        condition.where = condition.where + more + "role = '" + params.email + "'";
    }

    condition.limit = true;

    return condition
}
function getUsers(route, req, res) {
    var params = req.query;
    params.myRole = lib.currentUser(res).role;
    params.creator_id = lib.currentUser(res).id;

    var view = {'/': 'users/index', '/me':'users/index', '/index': 'users/_index'}[route];
    console.log(JSON.stringify(params));

    mysql.pagination('users', view, res, params, queryCondition);
}