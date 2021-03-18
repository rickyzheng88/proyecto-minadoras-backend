function checkCookies(req, res, next) {
    if (!req.cookies) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = checkCookies;