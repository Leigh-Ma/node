var express = require('express');
var router = express.Router();

var mysql = require('../service/mysql');

router.get('/login', function(req, res, next) {
    res.render('users/login')
});

router.post('/login', function (req, res, next) {
    var params = req.body;
    var user = {email: params['email']||'', password: params['password']||''};
    var sql = "select * from users where email = '" + user.email + "' and password_digest = '" + user.password + "'";
    console.log(sql);
    mysql.DB().query(sql, function(err, rows, fields){
        if(err) {
            res.json({error: 'invalid name or password' + err.message})
            throw err;
        }

        req.session.user = user;

        return res.redirect('/');
    });

});

module.exports = router;
