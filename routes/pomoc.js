var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/", function(req, res){
  res.redirect("/pomoc/nacini-pomoci");
});

router.get("/donacije", function(req, res){
  Podstran.findOne({naslov: "Donacije"}, function(err, podstran){
    if(podstran===null) return res.render("404");
    res.render("pomoc/donacije",
    {
      podstran: podstran,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(podstran===null) return res.render("404");
    res.render("pomoc/show",
    {
      podstran: podstran,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
