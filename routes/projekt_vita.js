var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/", function(req, res){
  res.render("projekt_vita/index", {nav_kategorije: req.nav_kategorije,
  nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Projekt Vita | Mačja hiša"})
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    res.render("projekt_vita/show",
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
