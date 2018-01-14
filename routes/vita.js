var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/", function(req, res){
  res.render("vita/index", {title: "Projekt Vita | Mačja hiša"})
});

router.get("/vita_po_zivljenju_za_zivljenje", function(req, res){
  res.render("vita/vita_po_zivljenju_za_zivljenje", {title: "Po življenju za življenje - Projekt Vita | Mačja hiša"})
});

router.get("/kako_zapustiti_premozenje_macji_hisi", function(req, res){
  res.render("vita/kako_zapustiti_premozenje_macji_hisi", {title: "Kako zapustiti premoženje Mačji hiši - Projekt Vita | Mačja hiša"})
});

router.get("/skrb_za_muce_po_smrti", function(req, res){
  res.render("vita/skrb_za_muce_po_smrti", {title: "Skrb za muce po smrti - Projekt Vita | Mačja hiša"})
});

router.get("/najpogostejsa_vprasanja", function(req, res){
  res.render("vita/najpogostejsa_vprasanja", {title: "Najpogostejša vprašanja - Projekt Vita | Mačja hiša"})
});

module.exports = router;
