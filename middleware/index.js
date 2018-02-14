var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Za to moraš biti prijavljen.");
    res.redirect("/admin/login");
};

middlewareObj.isAdmin = function(req, res, next){
    if(req.user && req.user.adminLevel == "admin"){
        return next();
    }
    req.flash("error", "Za to moraš imeti administratorske pravice.");
    res.redirect("/admin/login");
};

module.exports = middlewareObj;
