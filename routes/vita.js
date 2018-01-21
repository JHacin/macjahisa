var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/", function(req, res){
  res.render("vita/index", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Projekt Vita | Mačja hiša"})
});

router.get("/vita_po_zivljenju_za_zivljenje", function(req, res){
  res.render("vita/vita_po_zivljenju_za_zivljenje", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Po življenju za življenje - Projekt Vita | Mačja hiša"})
});

router.get("/kako_zapustiti_premozenje_macji_hisi", function(req, res){
  res.render("vita/kako_zapustiti_premozenje_macji_hisi", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Kako zapustiti premoženje Mačji hiši - Projekt Vita | Mačja hiša"})
});

router.get("/skrb_za_muce_po_smrti", function(req, res){
  res.render("vita/skrb_za_muce_po_smrti", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Skrb za muce po smrti - Projekt Vita | Mačja hiša"})
});

router.get("/najpogostejsa_vprasanja", function(req, res){
  res.render("vita/najpogostejsa_vprasanja", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Najpogostejša vprašanja - Projekt Vita | Mačja hiša"})
});

module.exports = router;
