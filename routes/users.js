var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql');
var lib   = require('../service/lib');

router.get('/logout', function(req, res, next){
    res.locals.session = undefined;
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
        if(err) {
            throw err;
        }

        if(rows.length > 0) {
            user = rows[0];
            user.password_digest = undefined;

            req.session.user = user;
            return res.redirect('/');
        }

        res.render('users/login', {notice:
            {message: 'invalid name or password'}
        })
    });

});

router.get('/me', function(req, res, next){
    res.redirect('/')
});

router.get('/', function(req, res, next){
    var params = req.query;
    var creator_id = lib.currentUser(res).id;
    var sql = "select * from users where creater_id = " + creator_id;

    if(params.user_id) {
        sql = "select * from users where id = " + params.user_id;
    } else if (params.email) {
        sql = sql + " and email like '" + params.email + "%'";
    } else if (params.role) {
        sql = sql + " and role = '" + params.email + "'";
    }

    mysql.DB().query(sql, function(err, rows){
        if(err){
            throw err;
        }
        res.render('users/index', {users: rows})
    });

});

module.exports = router;
