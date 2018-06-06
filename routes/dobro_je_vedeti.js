var express = require("express");
var router = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Clanek = require("../models/clanek");
var Izobrazevalna_vsebina = require("../models/izobrazevalna_vsebina");

router.get("/", function(req, res){
  res.redirect("/dobro_je_vedeti/izobrazevalne_vsebine");
});

router.get("/izobrazevalne_vsebine", function(req, res){
  Podstran.findOne({naslov: "Izobraževalne vsebine"}, function(err, podstran){
    if(err) return console.log(err);
    Izobrazevalna_vsebina.find({}).sort({datum: -1}).exec(function(err, vsebine){
      res.render("dobro_je_vedeti/izobrazevalne_vsebine", {nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani, sidebar_muce: req.sidebar_muce, title: "Izobraževalne vsebine | Mačja hiša",
      podstran: podstran, vsebine: vsebine})
    });
  });
});

router.get("/prispevki", function(req, res){
  Podstran.findOne({naslov: "Prispevki"}, function(err, podstran){
    if(err) return console.log(err);
    Clanek.find({}, function(err, clanki) {
      if(err) return console.log(err);
      res.render("dobro_je_vedeti/prispevki", {nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani, sidebar_muce: req.sidebar_muce, title: "Koristne informacije | Mačja hiša",
      podstran: podstran, clanki: clanki})
    });
  });
});

router.get("/prispevki/:id", function(req, res){
  Clanek.findOne({dbid: req.params.id}, function(err, clanek){
    if(err) return console.log(err);

    if(clanek.tip == "besedilo") {

      res.render("dobro_je_vedeti/clanek", {podstran: clanek,
        nav_kategorije: req.nav_kategorije, nav_podstrani: req.nav_podstrani,
        sidebar_muce: req.sidebar_muce,
        title: clanek.naslov + " | Mačja hiša", social_description: clanek.vsebina.replace(/<(?:.|\n)*?>/gm, ''),
        social_image: "http://" + req.headers.host + "/files/page/article_default.png"});

    } else if(clanek.tip == "datoteka"){
      res.redirect("/files/clanki/" + clanek.vsebina);
    } else if (clanek.tip =="povezava"){
      res.redirect(clanek.vsebina);
    }
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
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
