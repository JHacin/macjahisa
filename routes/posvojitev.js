var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/muce", function(req, res){
  Podstran.findOne({naslov: "Muce, ki iščejo dom"}, function(err, podstran){
    res.render("posvojitev/muce", {podstran: podstran, nav_kategorije: req.nav_kategorije,
    nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
    sidebar_muce: req.sidebar_muce, title: "Muce, ki iščejo dom | Mačja hiša"})
  });
});

// Začasno !!!!!!
router.get("/prikaz", function(req, res){
  res.render("posvojitev/prikaz", {nav_kategorije: req.nav_kategorije,
  nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Muca #1 | Mačja hiša"})
});
// Začasno !!!!!

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    res.render("posvojitev/show",
    {
      podstran: podstran,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
