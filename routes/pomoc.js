var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/", function(req, res){
  res.render("pomoc/index", {title: "Kako nam lahko pomagate? | Mačja hiša"})
});

router.get("/donacije", function(req, res){
  res.render("pomoc/donacije", {title: "Donacije | Mačja hiša"})
});

router.get("/dohodnina", function(req, res){
  res.render("pomoc/dohodnina", {title: "Namenite nam del dohodnine | Mačja hiša"})
});

module.exports = router;
