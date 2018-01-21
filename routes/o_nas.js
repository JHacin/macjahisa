var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/kaj_je_macja_hisa", function(req, res){
  res.render("o_nas/kaj_je_macja_hisa", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Kdo smo? | Mačja hiša"})
});

router.get("/zavetisce_mh", function(req, res){
  res.render("o_nas/zavetisce_mh", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Zavetišče MH | Mačja hiša"})
});

router.get("/kontakt", function(req, res){
  res.render("o_nas/kontakt", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Kontakt | Mačja hiša"})
});

router.get("/cenik", function(req, res){
  res.render("o_nas/cenik", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Cenik | Mačja hiša"})
});

router.get("/v_medijih", function(req, res){
  res.render("o_nas/v_medijih", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "V medijih | Mačja hiša"})
});

module.exports = router;
