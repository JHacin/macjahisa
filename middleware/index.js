var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Za to moraš biti prijavljen.");
    res.redirect("/admin/login");
};

module.exports = middlewareObj;
