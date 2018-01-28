var express = require("express");
var router = express.Router({mergeParams: true});
var Muca = require("../models/muca");
var Novica = require("../models/novica");
var Clanek = require("../models/clanek");
var Podstran = require("../models/podstran");
var Kategorija = require("../models/kategorija");
var moment = require("moment");

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

router.get("/muce/:id/edit/", function(req, res) {
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

router.get("/novice/:id/edit", function(req, res){
  Novica.findById(req.params.id, function(err, novica){
    if(err) return console.log(err);
    res.render("admin/novice/edit", {novica: novica});
  })
});

router.put("/novice/:id", function(req, res){
  Novica.findByIdAndUpdate(req.params.id, req.body.novica, function(err){
    if(err) return console.log(err);
    res.redirect("/admin/novice/");
  });
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
  Podstran.find({}).sort({datum: -1}).populate("kategorija").exec(function(err, podstrani) {
    if(err) return console.log(err);
    res.render("admin/podstrani/index", {podstrani: podstrani});
  })
});

router.post("/podstrani", function(req, res){
  Kategorija.findById(req.body.podstran.kategorija, function(err, kategorija){
    console.log(kategorija._id);
    if(err) return console.log(err);
    Podstran.create(req.body.podstran, function(err, podstran){
      if(err) {
        console.log(err);
      } else {

        podstran.dbid = kategorija.podstrani.length + 1;
        podstran.naslov_en = "";
        podstran.vsebina_en = "";
        podstran.vrstni_red = kategorija.podstrani.length + 1;
        podstran.include_after = "";
        podstran.portal = "M";
        podstran.include_before = "";
        podstran.zadnja_sprememba = moment();
        podstran.save();
        kategorija.podstrani.push(podstran);
        kategorija.save();
        res.redirect("/admin/podstrani");
      }
    });
  });
});

router.get("/podstrani/add", function(req, res){
  Kategorija.find({}, function(err, kategorije){
    res.render("admin/podstrani/add", {kategorije: kategorije});
  });
});

router.put("/podstrani/:id", function(req, res){
  Podstran.findByIdAndUpdate(req.params.id, req.body.podstran, function(err, podstran){
    if(err) return console.log(err);
    res.redirect("/admin/podstrani/");
  });
});

router.get("/podstrani/:id/edit", function(req, res){
  Podstran.findById(req.params.id, function(err, podstran) {
    Kategorija.find({}, function(err, kategorije){
      console.log(podstran);
      if(err) return console.log(err);
      res.render("admin/podstrani/edit", {podstran: podstran, kategorije: kategorije});
    });
  });
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

router.get("/menu/add", function(req, res){
  res.render("admin/menu/add");
});


router.post("/menu", function(req, res){
  Kategorija.create({naslov: req.body.naslov, url: req.body.url}, function(err, kategorija){
    res.redirect("/admin/menu/");
  })
});

router.get("/menu/:id/edit", function(req, res){
  Kategorija.findById(req.params.id, function(err, kategorija){
    if(err) return console.log(err);
    res.render("admin/menu/edit", {kategorija: kategorija});
  });
});

router.put("/menu/:id", function(req, res){
  Kategorija.findByIdAndUpdate(req.params.id, {naslov: req.body.naslov, url: req.body.url}, function(err, kategorija){
    if(err) return console.log(err);
    res.redirect("/admin/menu/" + kategorija._id + "/edit");
  });
});
// END MENU

module.exports = router;
