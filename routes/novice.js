var express = require("express");
var router  = express.Router({mergeParams: true});
var Novica = require("../models/novica");
var Podstran = require("../models/podstran");

router.get("/", function(req, res){
  Novica.find().where("objava").equals("1").sort({datum: -1}).exec(function(err, novice){
    res.render("novice/index",
    { novice: novice,
      podstran: {naslov: "Novice"},
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      title: "Novice | Mačja hiša"});
  });

});

router.get("/:id", function(req, res){
  Novica.findOne({dbid: req.params.id}, function(err, novica){
    res.render("novice/show", {
      novica: novica,
      podstran: novica,
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      title: novica.naslov + " | Mačja hiša",
      social_description: novica.vsebina.replace(/<(?:.|\n)*?>/gm, ''),
      social_image: "http://" + req.headers.host + "/files/" + novica.naslovna_slika
    });
  });
});


module.exports = router;
