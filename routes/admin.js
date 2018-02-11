var express = require("express");
var router = express.Router({mergeParams: true});
var Muca = require("../models/muca");
var Novica = require("../models/novica");
var Clanek = require("../models/clanek");
var Podstran = require("../models/podstran");
var Kategorija = require("../models/kategorija");
var Kontakt = require("../models/kontakt");
var Oskrbnica = require("../models/oskrbnica");
var Izobrazevalna_vsebina = require("../models/izobrazevalna_vsebina");
var moment = require("moment");
const nodemailer = require("nodemailer");

// MULTER
var multer = require("multer");
var storage_muce = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/oglasi_muce')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

var storage_clanki = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/clanki')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var storage_izobrazevanje = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/izobrazevanje')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var storage_novice = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload_muce = multer({ storage: storage_muce });
var upload_clanki = multer({ storage: storage_clanki });
var upload_izobrazevanje = multer({ storage: storage_izobrazevanje });
var upload_novice = multer({ storage: storage_novice });
// END MULTER

router.get("/", function(req, res){
  // index - preusmeri na seznam muc
  res.redirect("/admin/muce/iscejo");
});

// MUCE
router.get("/muce/iscejo", function(req, res){
  // prikaži vse muce po vrsti od nazadnje sprejete - SAMO AKTIVNE (iščejo dom ali pa so začasno pri nas)
  Muca.find().where("status").in([1, 2, 3]).sort({datum: -1}).exec(function(err, muce) {
    if(err) return console.log(err);
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/v_novem_domu", function(req, res){
  // prikaži vse muce po vrsti od nazadnje sprejete - SAMO V NOVEM DOMU
  Muca.find().where("status").equals(4).sort({datum: -1}).exec(function(err, muce) {
    if(err) return console.log(err);
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/arhiv", function(req, res){
  // prikaži vse muce po vrsti od nazadnje sprejete - SAMO V NOVEM DOMU
  Muca.find({}).sort({datum: -1}).exec(function(err, muce) {
    if(err) return console.log(err);
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/:id/edit/", function(req, res) {
  // prikaži obrazce za urejanje muce (po IDju)
  Muca.findOne({dbid: req.params.id}, function(err, muca) {
    Kontakt.find({}, function(err, kontakti){
      if(err) return console.log(err);
      res.render("admin/muce/edit", {muca: muca, kontakti: kontakti});
    });
  })
});

router.get("/muce/add", function(req, res){
  // prikaži obrazec za novo muco
  Kontakt.find({}, function(err, kontakti){
    res.render("admin/muce/add", {kontakti: kontakti});
  });
});

router.get("/muce/:id", function(req, res) {
  // prikaži muco po IDju
  Muca.findOne({dbid: req.params.id}, function(err, muca) {
    if(err) return console.log(err);
    res.render("admin/muce/show", {muca: muca});
  })
});

router.post("/muce", upload_muce.fields([
    {name: "slika1"}, {name: "slika2"}, {name: "slika3"}, {name: "slika4"}
  ]), (req, res) => {

  Muca.count({}, function(err, count){
    // dodaj novo muco
    Muca.create(req.body.muca, function(err, novaMuca) {
      if(err) return console.log(err);

      // VET STATUS
      for(var key in req.body.vet) {
          novaMuca.vet[key] = true;
      }

      // dodeli povezave do slik (če so)
      if(req.files.slika1) {
        novaMuca.file_name1 = req.files.slika1[0].filename;
      };
      if(req.files.slika2) {
        novaMuca.file_name2 = req.files.slika2[0].filename;
      };
      if(req.files.slika3) {
        novaMuca.file_name3 = req.files.slika3[0].filename;
      };
      if(req.files.slika4) {
        novaMuca.file_name4 = req.files.slika4[0].filename;
      };

      novaMuca.dbid = count + 1;
      // shrani
      novaMuca.save();

      res.redirect("/admin/muce/iscejo");
    });
  });
});

router.put("/muce/:id", upload_muce.fields([
    {name: "slika1"}, {name: "slika2"}, {name: "slika3"}, {name: "slika4"}
  ]), (req, res) => {

    var gre_v_nov_dom = false;

    // če gre muca v nov dom, pripravi za pošiljanje maila
    Muca.findById(req.params.id, function(err, muca){
      if(err) return console.log(err);
      if (req.body.muca.status == 4 && muca.status != 4) {
        gre_v_nov_dom = true;
      }
    });

    Muca.findByIdAndUpdate(req.params.id, req.body.muca, function(err, muca){
      if(err) return console.log(err);
      // resetiraj vet status pri muci
      muca.vet = { s_k: false, cipiranje: false, cepljenje: false,
                   razparazit: false, felv: false, fiv: false };

      // ponovno nastavi
      for(var key in req.body.vet) {
         muca.vet[key] = true;
      }

      // posodobi slike
      if(req.files.slika1) {
        muca.file_name1 = req.files.slika1[0].filename;
      };
      if(req.files.slika2) {
        muca.file_name2 = req.files.slika2[0].filename;
      };
      if(req.files.slika3) {
        muca.file_name3 = req.files.slika3[0].filename;
      };
      if(req.files.slika4) {
        muca.file_name4 = req.files.slika4[0].filename;
      };

      if(gre_v_nov_dom || (req.body.muca.status != 4 && muca.status == 4)) {
        muca.datum = moment();
      }

      muca.save();

      // če gre v nov dom pošlji maile ostalim oskrbrnicam
      if(gre_v_nov_dom) {
        Oskrbnica.find({}, function(err, oskrbnice){
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
              host: 'mail.macjahisa.si',
              port: 26,
              secure: false,
              tls: {
                rejectUnauthorized:false
              },
              auth: {
                  user: "obvestila@macjahisa.si",
                  pass: "obvestila123"
              }
          });

          // create array with email addresses
          var mailing_seznam = [];
          oskrbnice.forEach(function(oskrbnica){
            mailing_seznam.push(oskrbnica.email);
          });

          // gre/gresta
          var subject_stevilo = "gre";
          if(muca.nacin_posvojitve == "v_paru") {
            subject_stevilo = "gresta";
          }

          // html zapis
          var html_zapis = "";
          html_zapis += "<h3>" + muca.ime + " ";
          if(muca.nacin_posvojitve == "v_paru") {
            html_zapis += "gresta ";
          } else {
            html_zapis += "gre ";
          }
          html_zapis += "v nov dom.";
          html_zapis += "</h3><p>";
          html_zapis += "<strong>Datum spremembe: </strong>" + moment().format("D[.]M[.]YYYY");
          html_zapis += "</p>";
          html_zapis += "<p><em>To je samodejno generirano sporočilo.</em></p>"

          // setup email data with unicode symbols
          let mailOptions = {
              from: 'obvestila@macjahisa.si', // sender address
              to: mailing_seznam, // list of receivers
              subject: muca.ime + ' ' + subject_stevilo + ' v nov dom!', // Subject line
              text: muca.ime + ' ' + subject_stevilo + ' v nov dom. To je samodejno generirano sporočilo.', // plain text body
              html: html_zapis // html body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
          });
        });
      }

      res.redirect("/admin/muce/iscejo");
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
  Novica.findOne({dbid: req.params.id}, function(err, novica){
    if(err) return console.log(err);
    res.render("admin/novice/edit", {novica: novica});
  })
});

router.get("/novice/add", function(req, res){
  res.render("admin/novice/add");
});



router.post("/novice", upload_novice.single("novica[naslovna_slika]"), function(req, res, next){
  Novica.count({}, function(err, count){
    Novica.create(req.body.novica, function(err, novica){
      if(req.file) {
        novica.naslovna_slika = req.file.originalname;
      } else {
        novica.naslovna_slika = "default.png";
      }
      novica.dbid = count + 1;
      novica.save();
      res.redirect("/admin/novice");
    });
  })
});

router.put("/novice/:id", upload_novice.single("novica[nova_naslovna_slika]"), function(req, res, next){
  Novica.findByIdAndUpdate(req.params.id, req.body.novica, function(err, novica){
    if(err) return console.log(err);
    console.log(req.file);
      if (req.file) {
        novica.naslovna_slika = req.file.originalname;
        novica.save();
      }
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

router.get("/clanki/add_text", function(req, res){
  res.render("admin/clanki/add_text");
});

router.get("/clanki/add_file", function(req, res){
  res.render("admin/clanki/add_file");
});

router.get("/clanki/add_link", function(req, res){
  res.render("admin/clanki/add_link");
});

router.get("/clanki/:id/edit", function(req, res){
  Clanek.findOne({dbid: req.params.id}, function(err, clanek){
    if(err) return console.log(err);
    var tip = clanek.tip;
    if(tip=="datoteka") {
      res.render("admin/clanki/edit_file", {clanek: clanek});
    } else if(tip=="povezava") {
      res.render("admin/clanki/edit_link", {clanek: clanek});
    } else {
      res.render("admin/clanki/edit_text", {clanek: clanek});
    }
  });
});

router.post("/clanki_upload", upload_clanki.single("clanek[vsebina]"), function(req, res, next){
  Clanek.count({}, function(err, count){
    Clanek.create(req.body.clanek, function(err, clanek){
      if(err) return console.log(err);
      if(req.file) {
        clanek.vsebina = req.file.originalname;
        clanek.dbid = count + 1;
        clanek.save();
      };
      res.redirect("/admin/clanki");
    });
  });
});

router.post("/clanki", function(req, res){
  Clanek.count({}, function(err, count){
    Clanek.create(req.body.clanek, function(err, clanek){
      if(err) return console.log(err);
      clanek.dbid = count + 1;
      clanek.save();
      res.redirect("/admin/clanki");
    });
  });
});

router.get("/clanki/:id", function(req, res){
  Clanek.findOne({dbid: req.params.id}, function(err, clanek) {
    if(err) return console.log(err);
    if(clanek.tip == "povezava") {
      res.redirect(clanek.vsebina);
    } else if(clanek.tip == "datoteka") {
      res.redirect("/files/clanki/" + clanek.vsebina);
    } else {
      res.redirect("/dobro_je_vedeti/koristne_informacije/" + clanek.dbid);
    }
  });
});

router.put("/clanki/:id", function(req, res){
  Clanek.findOne({dbid: req.params.id}, req.body.clanek, function(err, clanek){
    if(err) return console.log(err);
    if (req.body.clanek.nova_vsebina != undefined && req.body.clanek.nova_vsebina != "") {
      clanek.vsebina = req.body.clanek.nova_vsebina;
      clanek.save();
    }
    res.redirect("/admin/clanki");
  });
});

router.put("/clanki_upload/:id", upload_clanki.single("clanek[nova_vsebina]"), function(req, res, next){
  Clanek.findByIdAndUpdate(req.params.id, req.body.clanek, function(err, clanek){
    if(err) return console.log(err);
    if (req.file) {
      clanek.vsebina = req.file.originalname;
      clanek.save();
    }
    res.redirect("/admin/clanki");
  });
});
// END ČLANKI

// BEGIN IZOBRAŽEVANJE
router.get("/izobrazevalne_vsebine", function(req, res){
  // prikaži vse vsebine po vrsti od nazadnje spremenjene
  Izobrazevalna_vsebina.find({}).sort({datum: -1}).exec(function(err, vsebine) {
    if(err) return console.log(err);
    res.render("admin/izobrazevalne_vsebine/index", {vsebine: vsebine});
  })
});

router.get("/izobrazevalne_vsebine/add", function(req, res){
  res.render("admin/izobrazevalne_vsebine/add");
});

router.get("/izobrazevalne_vsebine/:id/edit", function(req, res){
  Izobrazevalna_vsebina.findById(req.params.id, function(err, vsebina){
    if(err) return console.log(err);
    res.render("admin/izobrazevalne_vsebine/edit", {vsebina: vsebina})
  });
});

router.post("/izobrazevalne_vsebine", upload_izobrazevanje.fields([
    {name: "vsebina[datoteka]"}, {name: "vsebina[naslovna_slika]"}]), function(req, res, next){
  Izobrazevalna_vsebina.create(req.body.vsebina, function(err, vsebina){
    if(err) return console.log(err);
    if(req.files["vsebina[datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[datoteka]"][0].originalname;
      vsebina.save();
    };

    if(req.files["vsebina[naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[naslovna_slika]"][0].originalname;
      vsebina.save();
    };
    res.redirect("/admin/izobrazevalne_vsebine");
  });
});

router.put("/izobrazevalne_vsebine/:id", upload_izobrazevanje.fields([
    {name: "vsebina[nova_datoteka]"}, {name: "vsebina[nova_naslovna_slika]"}]), function(req, res, next){
  Izobrazevalna_vsebina.findByIdAndUpdate(req.params.id, req.body.vsebina, function(err, vsebina){
    if(err) return console.log(err);
    if(req.files["vsebina[nova_datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[nova_datoteka]"][0].originalname;
      vsebina.save();
    };
    if(req.files["vsebina[nova_naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[nova_naslovna_slika]"][0].originalname;
      vsebina.save();
    };
    res.redirect("/admin/izobrazevalne_vsebine");
  });
});
// END IZOBRAŽEVANJE

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
    if(err) return console.log(err);
    Podstran.create(req.body.podstran, function(err, podstran){
      if(err) {
        console.log(err);
      } else {
        podstran.dbid = kategorija.podstrani_length + 1;
        podstran.naslov_en = "";
        podstran.vsebina_en = "";
        podstran.vrstni_red = kategorija.podstrani_length + 1;
        podstran.include_after = "";
        podstran.include_before = "";
        podstran.zadnja_sprememba = moment();
        podstran.save();
        kategorija.podstrani_length +=1;
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
    Kategorija.findById(req.body.podstran.kategorija, function(err, kategorija){
      if(err) return console.log(err);
      kategorija.save();
      res.redirect("/admin/podstrani/");
    });
  });
});

router.get("/podstrani/:id/edit", function(req, res){
  Podstran.findById(req.params.id, function(err, podstran) {
    Kategorija.find({}, function(err, kategorije){
      if(err) return console.log(err);
      res.render("admin/podstrani/edit", {podstran: podstran, kategorije: kategorije});
    });
  });
});

// END PODSTRANI

// MENU
router.get("/menu", function(req, res){
  // prikaži vse podstrani po vrsti od nazadnje spremenjene
  Kategorija.find({}, function(err, kategorije) {
    if(err) return console.log(err);
    Podstran.find({}, function(err, podstrani) {
      if(err) return console.log(err);
      res.render("admin/menu/index", {kategorije: kategorije, podstrani: podstrani});
    });
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
    res.redirect("/admin/menu/");
  });
});
// END MENU

// BEGIN CONTACTS
router.get("/kontakti", function(req, res){
  Kontakt.find({}, function(err, kontakti) {
    if(err) return console.log(err);
      res.render("admin/kontakti/index", {kontakti: kontakti});
  })
});

router.get("/kontakti/add", function(req, res){
  res.render("admin/kontakti/add");
});

router.post("/kontakti", function(req, res){
  Kontakt.create(req.body.kontakt, function(err, kontakt){
    res.redirect("/admin/kontakti/");
  })
});

router.get("/kontakti/:id/edit", function(req, res){
  Kontakt.findById(req.params.id, function(err, kontakt){
    res.render("admin/kontakti/edit", {kontakt: kontakt});
  });
});

router.put("/kontakti/:id", function(req, res){
  Kontakt.findByIdAndUpdate(req.params.id, req.body.kontakt, function(err, kontakt) {
    if(err) return console.log(err);
      res.redirect("/admin/kontakti");
  })
});
// END CONTACTS

// OSKRBNICE
router.get("/oskrbnice", function(req, res){
  Oskrbnica.find({}, function(err, oskrbnice) {
    if(err) return console.log(err);
      res.render("admin/oskrbnice/index", {oskrbnice: oskrbnice});
  })
});

router.get("/oskrbnice/add", function(req, res){
  res.render("admin/oskrbnice/add");
});

router.post("/oskrbnice", function(req, res){
  Oskrbnica.create(req.body.oskrbnica, function(err, oskrbnica){
    res.redirect("/admin/oskrbnice/");
  })
});

router.get("/oskrbnice/:id/edit", function(req, res){
  Oskrbnica.findById(req.params.id, function(err, oskrbnica){
    res.render("admin/oskrbnice/edit", {oskrbnica: oskrbnica});
  });
});

router.put("/oskrbnice/:id", function(req, res){
  Oskrbnica.findByIdAndUpdate(req.params.id, req.body.oskrbnica, function(err, oskrbnica) {
    if(err) return console.log(err);
      res.redirect("/admin/oskrbnice");
  })
});
// END OSKRBNICE

module.exports = router;
