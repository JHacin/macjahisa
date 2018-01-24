var express = require("express");
var router = express.Router({mergeParams: true});
var Muca = require("../models/muca");
var Novica = require("../models/novica");
var Clanek = require("../models/clanek");
var Podstran = require("../models/podstran");
var Kategorija = require("../models/kategorija");

// MULTER
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/oglasi_muce')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.muca.ime + '-' + Date.now() + ".jpg")
  }
})
var upload = multer({ storage: storage });
// END MULTER

router.get("/", function(req, res){
  // index - preusmeri na seznam muc
  res.redirect("/admin/muce");
});

// MUCE
router.get("/muce", function(req, res){
  // prikaži vse muce po vrsti od nazadnje sprejete - SAMO AKTIVNE (iščejo dom ali pa so začasno pri nas)
  Muca.find().where("status").in([1, 2, 3]).sort({datum: -1}).exec(function(err, muce) {
    if(err) return console.log(err);
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/edit/:id", function(req, res) {
  // prikaži obrazce za urejanje muce (po IDju)
  Muca.findById(req.params.id, function(err, muca) {
    if(err) return console.log(err);
    res.render("admin/muce/edit", {muca: muca});
  })
});

router.get("/muce/add", function(req, res){
  // prikaži obrazec za novo muco
  res.render("admin/muce/add");
});

router.get("/muce/:id", function(req, res) {
  // prikaži muco po IDju
  Muca.findById(req.params.id, function(err, muca) {
    if(err) return console.log(err);
    res.render("admin/muce/show", {muca: muca});
  })
});

router.post("/muce", upload.fields([
    {name: "slika1"}, {name: "slika2"}, {name: "slika3"}, {name: "slika4"}
  ]), (req, res) => {

  // dodaj novo muco
  Muca.create(req.body.muca, function(err, novaMuca) {
    if(err) return console.log(err);

    // dodeli povezave do slik (če so)
    if(req.files.slika1) {
      novaMuca.file_name1 = req.files.slika1[0].filename;
    };
    if(req.files.slika2) {
      novaMuca.file_name2 = req.files.slika1[0].filename;
    };
    if(req.files.slika3) {
      novaMuca.file_name3 = req.files.slika1[0].filename;
    };
    if(req.files.slika4) {
      novaMuca.file_name4 = req.files.slika1[0].filename;
    };
    // shrani
    novaMuca.save();

    res.redirect("/admin/muce");
  });

});
// END muce

// NOVICE
router.get("/novice", function(req, res){
  Novica.find({}, function(err, novice){
    if(err) return console.log(err);
    res.render("admin/novice/index", {novice: novice});
  })
});
// END NOVICE

// ČLANKI
router.get("/clanki", function(req, res){
  // prikaži vse članke po vrsti od nazadnje objavljenega
  Clanek.find({}).sort({datum: -1}).exec(function(err, clanki) {
    if(err) return console.log(err);
    res.render("admin/clanki/index", {clanki: clanki});
  })
});
// END ČLANKI

// PODSTRANI
router.get("/podstrani", function(req, res){
  // prikaži vse podstrani po vrsti od nazadnje spremenjene
  Podstran.find({}).sort({datum: -1}).exec(function(err, podstrani) {
    if(err) return console.log(err);
    res.render("admin/podstrani/index", {podstrani: podstrani});
  })
});
// END PODSTRANI

// MENU
router.get("/menu", function(req, res){
  // prikaži vse podstrani po vrsti od nazadnje spremenjene
  Kategorija.find({}).populate("podstrani").exec(function(err, kategorije) {
    if(err) return console.log(err);
    res.render("admin/menu/index", {kategorije: kategorije});
  })
});

router.post("/menu", function(req, res){
  Kategorija.create({naslov: req.body.naslov}, function(err, kategorija){
    if(err) return console.log(err);
    console.log("Kategorija dodana.");
    res.redirect("/admin/menu");
  });
});

router.get("/menu/add", function(req, res){
    res.render("admin/menu/add");
});
// END MENU

module.exports = router;
