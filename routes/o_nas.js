var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/kaj_je_macja_hisa", function(req, res){
  res.render("o_nas/kaj_je_macja_hisa", {title: "Kdo smo? | Mačja hiša"})
});

router.get("/zavetisce_mh", function(req, res){
  res.render("o_nas/zavetisce_mh", {title: "Zavetišče MH | Mačja hiša"})
});

router.get("/kontakt", function(req, res){
  res.render("o_nas/kontakt", {title: "Kontakt | Mačja hiša"})
});

router.get("/cenik", function(req, res){
  res.render("o_nas/cenik", {title: "Cenik | Mačja hiša"})
});

router.get("/v_medijih", function(req, res){
  res.render("o_nas/v_medijih", {title: "V medijih | Mačja hiša"})
});

module.exports = router;
