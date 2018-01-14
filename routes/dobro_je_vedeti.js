var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/sterilizacija_in_kastracija", function(req, res){
  res.render("dobro_je_vedeti/sterilizacija_in_kastracija", {title: "Sterilizacija in kastracija | Mačja hiša"})
});

router.get("/izobrazevalne_vsebine", function(req, res){
  res.render("dobro_je_vedeti/izobrazevalne_vsebine", {title: "Izobraževalne vsebine | Mačja hiša"})
});

router.get("/koristne_informacije", function(req, res){
  res.render("dobro_je_vedeti/koristne_informacije", {title: "Koristne informacije | Mačja hiša"})
});

module.exports = router;
