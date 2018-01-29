var express = require("express");
var router = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Muca = require("../models/muca");

router.get("/muce", function(req, res){
  Podstran.findOne({naslov: "Muce, ki iščejo dom"}, function(err, podstran){
    if(err) return console.log(err);
    res.render("posvojitev/muce", {podstran: podstran, nav_kategorije: req.nav_kategorije,
    nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
    sidebar_muce: req.sidebar_muce, title: "Muce, ki iščejo dom | Mačja hiša"})
  });
});

router.get("/muce/:id", function(req, res){
  Muca.findById(req.params.id, function (err, muca){
    if(err) return console.log(err);
    res.render("posvojitev/prikaz", {muca: muca, nav_kategorije: req.nav_kategorije,
    nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
    sidebar_muce: req.sidebar_muce, title: muca.ime + " | Mačja hiša"})
  });
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(err) return console.log(err);
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
