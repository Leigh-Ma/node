
module.exports.currentUser = function(respond) {
    if(respond.locals.session && respond.locals.session.user) {
        return respond.locals.session.user
    } else {
        return undefined;
    }
};