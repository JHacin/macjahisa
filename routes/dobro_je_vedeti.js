var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/izobrazevalne_vsebine", function(req, res){
  res.render("dobro_je_vedeti/izobrazevalne_vsebine", {nav_kategorije: req.nav_kategorije,
  nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
  sidebar_muce: req.sidebar_muce, title: "Izobraževalne vsebine | Mačja hiša"})
});

router.get("/koristne_informacije", function(req, res){
  res.render("dobro_je_vedeti/koristne_informacije", {nav_kategorije: req.nav_kategorije,
  nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
  sidebar_muce: req.sidebar_muce, title: "Koristne informacije | Mačja hiša"})
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
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
