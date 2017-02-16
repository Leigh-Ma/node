var mysql = require('promise-mysql');

var dbConfig = {
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'artist_work_dev'
};

var pool = mysql.createPool(dbConfig);

module.exports.DB = function () {
    return pool
};

module.exports.pagination = function(table, view, res, params, conditionCb){
    var dbRes = {}
    dbRes.page  = params['page']  || 0;
    dbRes.limit = params['limit'] || 20;
    dbRes.table = table;

    pool.query(sqlNumRow(table, params, conditionCb)).then(function(result){
        dbRes.totalRow = result[0]['numRow'];
        dbRes.totalPage= Math.ceil(dbRes.totalRow/dbRes.limit);

    }).then(function() {
        pool.query(sqlQuery(table, params, dbRes, conditionCb)).then(function (result) {
            pageCurrent(dbRes);
            console.log('pagination: ', JSON.stringify(dbRes));
            dbRes.rows = result;
            if (dbRes.page < dbRes.totalPage) {
            } else {
                err: 'query page error, exceed max page'
            }


            res.render(view, dbRes)

        }).catch(function (err) {
            console.error(err);
            dbRes.notice = {message: err};
            res.render(view, dbRes)

        })
    }).catch(function (err) {
        console.error(err);
        dbRes.notice = {message: err};
        res.render(view, dbRes)
    })

};


function sqlQuery(table, params, dbRes, conditionCb) {
    var condition =  conditionCb(params)
    var sql = 'select * from ' + table + ' ' + condition['where'];
    if(condition['limit']) {
        sql = sql + ' limit ' + dbRes.limit + ' offset ' + dbRes.page * dbRes.limit;
    }
    console.log("DATA  SQL: ", sql);
    return sql;
}

function sqlNumRow(table, params, conditionCb) {
    var sql = 'select count(*) as numRow from ' + table + ' ' + conditionCb(params)['where'] ;
    console.log("COUNT SQL: ", sql);
    return sql;
}

function pageCurrent(dbRes) {
    var beginPage, endPage;
    var current = dbRes.page;

    beginPage = current - 5;
    if(beginPage < 0) {
        beginPage = 0;
    }

    endPage = beginPage + 9;
    if(endPage >= dbRes.totalPage)
        endPage = dbRes.totalPage - 1;

    dbRes.beginPage = beginPage;
    dbRes.endPage = endPage;
}