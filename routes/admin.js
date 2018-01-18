var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/", function(req, res){
  res.redirect("/admin/muce");
});

router.get("/muce", function(req, res){
  res.render("admin/muce");
});



module.exports = router;
