var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/", function(req, res){
  res.render("pomoc/index", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Kako nam lahko pomagate? | Mačja hiša"})
});

router.get("/donacije", function(req, res){
  res.render("pomoc/donacije", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Donacije | Mačja hiša"})
});

router.get("/dohodnina", function(req, res){
  res.render("pomoc/dohodnina", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Namenite nam del dohodnine | Mačja hiša"})
});

module.exports = router;
