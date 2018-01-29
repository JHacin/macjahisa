var express = require("express");
var router = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Clanek = require("../models/clanek");

router.get("/izobrazevalne_vsebine", function(req, res){
  Podstran.findOne({naslov: "Izobraževalne vsebine"}, function(err, podstran){
    if(err) return console.log(err);
    res.render("dobro_je_vedeti/izobrazevalne_vsebine", {nav_kategorije: req.nav_kategorije,
    nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
    sidebar_muce: req.sidebar_muce, title: "Izobraževalne vsebine | Mačja hiša",
    podstran: podstran})
  });
});

router.get("/koristne_informacije", function(req, res){
  Podstran.findOne({naslov: "Koristne informacije"}, function(err, podstran){
    if(err) return console.log(err);
    res.render("dobro_je_vedeti/koristne_informacije", {nav_kategorije: req.nav_kategorije,
    nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
    sidebar_muce: req.sidebar_muce, title: "Koristne informacije | Mačja hiša",
    podstran: podstran})
  });
});

router.get("/koristne_informacije/:id", function(req, res){
  Clanek.findById(req.params.id, function(err, clanek){
    if(err) return console.log(err);
    res.render("dobro_je_vedeti/clanek", {clanek: clanek,
      nav_kategorije: req.nav_kategorije, nav_podstrani: req.nav_podstrani,
      sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce,
      title: clanek.naslov + " | Mačja hiša"})
  });
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(err) return console.log(err);
    res.render("dobro_je_vedeti/show",
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
