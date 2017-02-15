var mysql = require('mysql')

var db = {
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'artist_work_dev'
};

var pool = mysql.createPool(db);
console.log(db)

module.exports.DB = function () {
    return pool
};
