var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Za to moraš biti prijavljen.");
    res.redirect("/admin/login");
};

middlewareObj.isPageEditor = function(req, res, next){

    if(req.user && (req.user.adminLevel == "admin" || req.user.adminLevel == "owner" || req.user.adminLevel == "page_editor")){
        return next();
    }
    req.flash("error", "Za to nimaš primernih administratorskih pravic.");
    res.redirect("/admin");
};

middlewareObj.isAdmin = function(req, res, next){

    if(req.user && (req.user.adminLevel == "admin" || req.user.adminLevel == "owner")){
        return next();
    }
    req.flash("error", "Za to moraš imeti administratorske pravice.");
    res.redirect("/admin");
};

middlewareObj.isOwner = function(req, res, next){
    if(req.user && req.user.adminLevel == "owner"){
        return next();
    }
    req.flash("error", "Za to moraš imeti pravice lastnika.");
    res.redirect("/admin");
};

module.exports = middlewareObj;
