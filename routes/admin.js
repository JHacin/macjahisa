var express = require("express");
var router = express.Router({mergeParams: true});
var Muca = require("../models/muca");
var Clanek = require("../models/clanek");
var Podstran = require("../models/podstran");
var Naslovnica = require("../models/naslovnica");
var Kategorija = require("../models/kategorija");
var Kontakt = require("../models/kontakt");
var Oskrbnica = require("../models/oskrbnica");
var Izobrazevalna_vsebina = require("../models/izobrazevalna_vsebina");
var Otroci_vsebina = require("../models/otroci_vsebina");
var User = require("../models/user");
var moment = require("moment");
var passport = require("passport");
var middleware = require("../middleware");
const nodemailer = require("nodemailer");
var crypto = require("crypto");
var async = require("async");
const fs = require("fs");

// MULTER
var multer = require("multer");
var storage_muce = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/oglasi_muce')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(/[ )(]/g,''))
  }
})

var storage_clanki = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/clanki')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/[ )(]/g,''))
  }
})

var storage_izobrazevanje = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/izobrazevanje')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/[ )(]/g,''))
  }
})

var storage_otroci = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/otroski-koticek')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/[ )(]/g,''))
  }
})

var storage_naslovnice = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/naslovnice')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(/[ )(]/g,''))
  }
})

var upload_muce = multer({ storage: storage_muce, limits: { fieldSize: 25 * 1024 * 10240 } });
var upload_clanki = multer({ storage: storage_clanki, limits: { fieldSize: 25 * 1024 * 10240 } });
var upload_izobrazevanje = multer({ storage: storage_izobrazevanje, limits: { fieldSize: 25 * 1024 * 10240 } });
var upload_otroci = multer({ storage: storage_otroci, limits: { fieldSize: 25 * 1024 * 10240 } });
var upload_naslovnice = multer({ storage: storage_naslovnice, limits: { fieldSize: 25 * 1024 * 10240 } });
// END MULTER

// INDEX ADMIN
router.get("/", function(req, res){
  if(req.user){
    return res.redirect("/admin/muce/iscejo");
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/login", function(req, res){
  res.render("admin/login");
});

router.get("/register", function(req, res){
  res.render("admin/register");
});

// LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/admin/muce/iscejo",
        failureRedirect: "/admin/login"
    }), function(req, res) {
});

// LOGOUT LOGIC
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Odjava uspešna.");
    res.redirect("/admin/login");
});

// MUCE
router.get("/muce/iscejo", middleware.isLoggedIn, function(req, res){
  Muca.find().where("status").in([1, 2]).sort({datum: -1}).exec(function(err, muce) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/muce/index", {muce: muce});
  })
});

// MUCE KI IŠČEJO BOTRA
router.get("/muce/iscejo_botra", middleware.isLoggedIn, function(req, res){
  Muca.find().where("posvojitev_na_daljavo").equals(1).where("status").in([1, 2, 3]).sort({datum: -1}).exec(function(err, muce) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/muce/index_boter", {muce: muce});
  })
});

router.get("/muce/v-novem-domu", middleware.isLoggedIn, function(req, res){
  Muca.find().where("status").equals(4).sort({datum: -1}).exec(function(err, muce) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/arhiv", middleware.isLoggedIn, function(req, res){
  Muca.find({}).sort({datum: -1}).exec(function(err, muce) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/:id/edit/", middleware.isLoggedIn, function(req, res) {
  Muca.findOne({dbid: req.params.id}, function(err, muca) {
    Kontakt.find({}, function(err, kontakti){
      if(err) {
        req.flash("error", "Prišlo je do napake v bazi podatkov.");
        return res.redirect("/admin/muce/iscejo");
      }
      res.render("admin/muce/edit", {muca: muca, kontakti: kontakti});
    });
  })
});

router.get("/muce/add", middleware.isLoggedIn, function(req, res){
  Kontakt.find({}, function(err, kontakti){
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/muce/iscejo");
    }
    res.render("admin/muce/add", {kontakti: kontakti});
  });
});

router.post("/muce", middleware.isLoggedIn, function(req, res) {
    Muca.count({}, function(err, count){
      // dodaj novo muco
      Muca.create(req.body, function(err, novaMuca) {
        if(err) {
          req.flash("error", "Prišlo je do napake.");
          return res.redirect("/admin/login");
        }

          novaMuca.dbid = count + 1;

          // VET STATUS
          for(var key in req.body.vet) {
            novaMuca.vet[key] = req.body.vet[key];
          }

          // slike
          if(req.body.slika1_crop) {
            var base64_string = req.body.slika1_crop.replace(/^data:image\/\w+;base64,/, "");
            var imageBuffer = Buffer.from(base64_string, 'base64');
            var imageName = novaMuca.dbid + "_" + "_1" + ".jpeg";
            var fileLocation = "public/files/oglasi_muce/" + imageName;
            try {
              fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
            } catch (e) {
              console.error(e);
            }
            novaMuca.file_name1 = imageName;
            novaMuca.save(function (err) {
              if (err) return handleError(err);
              // saved!
            });
          }

          if(req.body.slika2_crop) {
            var base64_string = req.body.slika2_crop.replace(/^data:image\/\w+;base64,/, "");
            var imageBuffer = Buffer.from(base64_string, 'base64');
            var imageName = novaMuca.dbid + "_" + "_2" + ".jpeg";
            var fileLocation = "public/files/oglasi_muce/" + imageName;
            try {
              fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
            } catch (e) {
              console.error(e);
            }
            novaMuca.file_name2 = imageName;
            novaMuca.save(function (err) {
              if (err) return handleError(err);
              // saved!
            });
          }

          if(req.body.slika3_crop) {
            var base64_string = req.body.slika3_crop.replace(/^data:image\/\w+;base64,/, "");
            var imageBuffer = Buffer.from(base64_string, 'base64');
            var imageName = novaMuca.dbid + "_" + "_3" + ".jpeg";
            var fileLocation = "public/files/oglasi_muce/" + imageName;
            try {
              fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
            } catch (e) {
              console.error(e);
            }
            novaMuca.file_name3 = imageName;
            novaMuca.save(function (err) {
              if (err) return handleError(err);
              // saved!
            });
          }

          if(req.body.slika4_crop) {
            var base64_string = req.body.slika4_crop.replace(/^data:image\/\w+;base64,/, "");
            var imageBuffer = Buffer.from(base64_string, 'base64');
            var imageName = novaMuca.dbid + "_" + "_4" + ".jpeg";
            var fileLocation = "public/files/oglasi_muce/" + imageName;
            try {
              fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
            } catch (e) {
              console.error(e);
            }
            novaMuca.file_name4 = imageName;
            novaMuca.save(function (err) {
              if (err) return handleError(err);
              // saved!
            });
          }

          // poprava imen (ki vključejejo nepotreben CAPS LOCK)
          var ime = req.body.ime;
          ime = ime.toLowerCase();
          ime = ime.charAt(0).toUpperCase() + ime.slice(1);
          if(ime.indexOf(" in ") != -1) {
            var index = ime.indexOf(" in ");
            ime = ime.substring(0, index + 4) + ime.charAt(index + 4).toUpperCase() + ime.slice(index + 5);
          };

          novaMuca.ime = ime;
          novaMuca.boter_povezava = req.body.boter_povezava;
          novaMuca.SEOmetaTitle = req.body.SEOmetaTitle;
          novaMuca.SEOmetaDescription = req.body.SEOmetaDescription;
          novaMuca.SEOfbTitle = req.body.SEOfbTitle;
          novaMuca.SEOfbDescription = req.body.SEOfbDescription;
          novaMuca.SEOtwitterTitle = req.body.SEOtwitterTitle;
          novaMuca.SEOtwitterDescription = req.body.SEOtwitterDescription;

          // shrani
          novaMuca.save(function (err) {
            if (err) return handleError(err);
            // saved!
          });

          req.flash("success", "Nova muca dodana.");
          res.send({redirect: '/admin/muce/iscejo'});
      });
    });
});

router.put("/muce/:id", middleware.isLoggedIn, function(req, res){
  Muca.findById(req.params.id, function(err, muca){
    var gre_v_nov_dom = false;

    if(err) {
      req.flash("error", "Muce ne najdem v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    if (req.body.status == 4 && muca.status != 4) {
      gre_v_nov_dom = true;
    }

    // popravi ime (velike začetnice)
    var ime = req.body.ime;
    ime = ime.toLowerCase();
    ime = ime.charAt(0).toUpperCase() + ime.slice(1);
    if(ime.indexOf(" in ") != -1) {
      var index = ime.indexOf(" in ");
      ime = ime.substring(0, index + 4) + ime.charAt(index + 4).toUpperCase() + ime.slice(index + 5);
    };

    // // posodobi podatke
    muca.ime = ime;
    muca.boter_povezava = req.body.boter_povezava;
    muca.SEOmetaTitle = req.body.SEOmetaTitle;
    muca.SEOmetaDescription = req.body.SEOmetaDescription;
    muca.SEOfbTitle = req.body.SEOfbTitle;
    muca.SEOfbDescription = req.body.SEOfbDescription;
    muca.SEOtwitterTitle = req.body.SEOtwitterTitle;
    muca.SEOtwitterDescription = req.body.SEOtwitterDescription;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    muca.datum = req.body.datum;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    muca.status = req.body.status;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    muca.mesec_rojstva = req.body.mesec_rojstva;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    muca.spol = req.body.spol;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });

    muca.opis = req.body.opis;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });

    muca.kontakt = req.body.kontakt;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });

    muca.posvojitev_na_daljavo = req.body.posvojitev_na_daljavo;
    muca.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });

      // resetiraj vet status pri muci
      muca.vet = { s_k: false, cipiranje: false, cepljenje: false,
                   razparazit: false, felv: false, fiv: false };

      // ponovno nastavi
      for(var key in req.body.vet) {
        muca.vet[key] = req.body.vet[key];
      }

      muca.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });

      // spremeni datum 'sprejema' pri muci ki gre v nov dom (ali je prišla nazaj)
      if(gre_v_nov_dom || (req.body.status != 4 && muca.status == 4)) {
        muca.datum = moment();
      }

      muca.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });

      if(req.body.slika1_crop) {
        var base64_string = req.body.slika1_crop.replace(/^data:image\/\w+;base64,/, "");
        var imageBuffer = Buffer.from(base64_string, 'base64');
        var imageName = muca.dbid + "_" + "_1" + ".jpeg";
        var fileLocation = "public/files/oglasi_muce/" + imageName;
        try {
          fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
        } catch (e) {
          console.error(e);
        }
        muca.file_name1 = imageName;
        muca.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }

      if(req.body.slika2_crop) {
        var base64_string = req.body.slika2_crop.replace(/^data:image\/\w+;base64,/, "");
        var imageBuffer = Buffer.from(base64_string, 'base64');
        var imageName = muca.dbid + "_" + "_2" + ".jpeg";
        var fileLocation = "public/files/oglasi_muce/" + imageName;
        try {
          fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
        } catch (e) {
          console.error(e);
        }
        muca.file_name2 = imageName;
        muca.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }

      if(req.body.slika3_crop) {
        var base64_string = req.body.slika3_crop.replace(/^data:image\/\w+;base64,/, "");
        var imageBuffer = Buffer.from(base64_string, 'base64');
        var imageName = muca.dbid + "_" + "_3" + ".jpeg";
        var fileLocation = "public/files/oglasi_muce/" + imageName;
        try {
          fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
        } catch (e) {
          console.error(e);
        }
        muca.file_name3 = imageName;
        muca.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }

      if(req.body.slika4_crop) {
        var base64_string = req.body.slika4_crop.replace(/^data:image\/\w+;base64,/, "");
        var imageBuffer = Buffer.from(base64_string, 'base64');
        var imageName = muca.dbid + "_" + "_4" + ".jpeg";
        var fileLocation = "public/files/oglasi_muce/" + imageName;
        try {
          fs.writeFileSync(fileLocation, imageBuffer, {encoding:"base64"});
        } catch (e) {
          console.error(e);
        }
        muca.file_name4 = imageName;
        muca.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }

    // muca.save();

    // če gre v nov dom
    if(gre_v_nov_dom) {
      Oskrbnica.find({}, function(err, oskrbnice){
        if(err) {
          req.flash("error", "Prišlo je do napake pri pošiljanju e-mail obvestila.");
          return res.redirect("/admin/muce/iscejo");
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.macjahisa.si',
            port: 26,
            secure: false,
            tls: {
              rejectUnauthorized:false
            },
            auth: {
                user: process.env.NOTIF_MAIL,
                pass: process.env.NOTIF_MAIL_PW
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
            from: process.env.NOTIF_MAIL, // sender address
            to: mailing_seznam, // list of receivers
            subject: muca.ime + ' ' + subject_stevilo + ' v nov dom!', // Subject line
            text: muca.ime + ' ' + subject_stevilo + ' v nov dom. To je samodejno generirano sporočilo.', // plain text body
            html: html_zapis // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
              req.flash("error", "Prišlo je do napake pri pošiljanju e-mail obvestila.");
              return res.redirect("/admin/muce/iscejo");
            }
            console.log('Message sent: %s', info.messageId);
        });
      });
    };
      // muca.save();
      req.flash("success", "Podatki muce posodobljeni.");
      res.send({redirect: '/admin/muce/iscejo'});
  });
});
// END MUCE

// ČLANKI
router.get("/clanki", middleware.isPageEditor, function(req, res){
  // prikaži vse članke po vrsti od nazadnje objavljenega
  Clanek.find({}).sort({datum: -1}).exec(function(err, clanki) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/clanki/index", {clanki: clanki});
  })
});

router.get("/clanki/add_text", middleware.isPageEditor, function(req, res){
  res.render("admin/clanki/add_text");
});

router.get("/clanki/add_file", middleware.isPageEditor, function(req, res){
  res.render("admin/clanki/add_file");
});

router.get("/clanki/add_link", middleware.isPageEditor, function(req, res){
  res.render("admin/clanki/add_link");
});

router.get("/clanki/:id/edit", middleware.isPageEditor, function(req, res){
  Clanek.findOne({dbid: req.params.id}, function(err, clanek){
    if(err) {
      req.flash("error", "Članka ne najdem v bazi podatkov.");
      return res.redirect("/admin/clanki");
    }
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

router.post("/clanki_upload", middleware.isPageEditor, upload_clanki.single("clanek[vsebina]"), function(req, res, next){
  Clanek.count({}, function(err, count){
    Clanek.create(req.body.clanek, function(err, clanek){
      if(err) {
        req.flash("error", "Prišlo je do napake pri dodajanju prispevka.");
        return res.redirect("/admin/clanki");
      }
      if(req.file) {
        clanek.vsebina = req.file.originalname.replace(/[ )(]/g,'');
        clanek.dbid = count + 1;
        clanek.save();
      };
      req.flash("success", "Prispevek dodan.");
      res.redirect("/admin/clanki");
    });
  });
});

router.post("/clanki", middleware.isPageEditor, function(req, res){
  Clanek.count({}, function(err, count){
    Clanek.create(req.body.clanek, function(err, clanek){
      if(err) {
        req.flash("error", "Prišlo je do napake pri dodajanju prispevka.");
        return res.redirect("/admin/clanki");
      }
      clanek.dbid = count + 1;
      clanek.save();
      req.flash("success", "Prispevek dodan.");
      res.redirect("/admin/clanki");
    });
  });
});

router.get("/clanki/:id", middleware.isPageEditor, function(req, res){
  Clanek.findOne({dbid: req.params.id}, function(err, clanek) {
    if(err) {
      req.flash("error", "Članka ne najdem v bazi podatkov.");
      return res.redirect("/admin/clanki");
    }
    if(clanek.tip == "povezava") {
      res.redirect(clanek.vsebina);
    } else if(clanek.tip == "datoteka") {
      res.redirect("/files/clanki/" + clanek.vsebina);
    } else {
      res.redirect("/dobro-je-vedeti/prispevki-clanki-povezave/" + clanek.dbid);
    }
  });
});

router.put("/clanki/:id", middleware.isPageEditor, function(req, res){
  Clanek.findOneAndUpdate({dbid: req.params.id}, req.body.clanek, function(err, clanek){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju prispevka.");
      return res.redirect("/admin/clanki");
    }

    if (req.body.clanek.nova_vsebina != undefined && req.body.clanek.nova_vsebina != "") {
      clanek.vsebina = req.body.clanek.nova_vsebina;
      clanek.save();
    }
    // posodobi kategorijo
    if (!clanek.kategorija || (clanek.kategorija !== req.body.clanek.kategorija)) {
      clanek.kategorija = req.body.clanek.kategorija;
      clanek.save();
    }
    req.flash("success", "Prispevek posodobljen.");
    res.redirect("/admin/clanki");
  });
});

router.put("/clanki_upload/:id", middleware.isPageEditor, upload_clanki.single("clanek[nova_vsebina]"), function(req, res, next){
  Clanek.findByIdAndUpdate(req.params.id, req.body.clanek, function(err, clanek){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju prispevka.");
      return res.redirect("/admin/clanki");
    }
    if (req.file) {
      clanek.vsebina = req.file.originalname.replace(/[ )(]/g,'');
      clanek.save();
    }
    req.flash("success", "Prispevek posodobljen.");
    res.redirect("/admin/clanki");
  });
});
// END ČLANKI

// BEGIN IZOBRAŽEVANJE
router.get("/izobrazevalne-vsebine", middleware.isPageEditor, function(req, res){
  // prikaži vse vsebine po vrsti od nazadnje spremenjene
  Izobrazevalna_vsebina.find({}).sort({datum: -1}).exec(function(err, vsebine) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/izobrazevalne-vsebine/index", {vsebine: vsebine});
  })
});

router.get("/izobrazevalne-vsebine/add", middleware.isPageEditor, function(req, res){
  res.render("admin/izobrazevalne-vsebine/add");
});

router.get("/izobrazevalne-vsebine/:id/edit", middleware.isPageEditor, function(req, res){
  Izobrazevalna_vsebina.findById(req.params.id, function(err, vsebina){
    if(err) {
      req.flash("error", "Vsebine ne najdem v bazi podatkov.");
      return res.redirect("/admin/izobrazevalne-vsebine");
    }
    res.render("admin/izobrazevalne-vsebine/edit", {vsebina: vsebina})
  });
});

router.post("/izobrazevalne-vsebine", middleware.isPageEditor, upload_izobrazevanje.fields([
    {name: "vsebina[datoteka]"}, {name: "vsebina[naslovna_slika]"}]), function(req, res, next){
  Izobrazevalna_vsebina.create(req.body.vsebina, function(err, vsebina){
    if(err) {
      req.flash("error", "Prišlo je do napake pri vnosu vsebine.");
      return res.redirect("/admin/izobrazevalne-vsebine");
    }
    if(req.files["vsebina[datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[datoteka]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };

    if(req.files["vsebina[naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[naslovna_slika]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    req.flash("success", "Vsebina dodana.");
    res.redirect("/admin/izobrazevalne-vsebine");
  });
});

router.put("/izobrazevalne-vsebine/:id", middleware.isPageEditor, upload_izobrazevanje.fields([
    {name: "vsebina[nova_datoteka]"}, {name: "vsebina[nova_naslovna_slika]"}]), function(req, res, next){
  Izobrazevalna_vsebina.findByIdAndUpdate(req.params.id, req.body.vsebina, function(err, vsebina){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju vsebine.");
      return res.redirect("/admin/izobrazevalne-vsebine");
    }
    if(req.files["vsebina[nova_datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[nova_datoteka]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    if(req.files["vsebina[nova_naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[nova_naslovna_slika]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    req.flash("success", "Vsebina posodobljena.");
    res.redirect("/admin/izobrazevalne-vsebine");
  });
});
// END IZOBRAŽEVANJE

// BEGIN OTROŠKI KOTIČEK
router.get("/koticek-za-otroke", middleware.isPageEditor, function(req, res){
  Otroci_vsebina.find({}).sort({datum: -1}).exec(function(err, vsebine) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/koticek-za-otroke/index", {vsebine: vsebine});
  })
});

router.get("/koticek-za-otroke/add", middleware.isPageEditor, function(req, res){
  res.render("admin/koticek-za-otroke/add");
});

router.get("/koticek-za-otroke/:id/edit", middleware.isPageEditor, function(req, res){
  Otroci_vsebina.findById(req.params.id, function(err, vsebina){
    if(err) {
      req.flash("error", "Vsebine ne najdem v bazi podatkov.");
      return res.redirect("/admin/koticek-za-otroke");
    }
    res.render("admin/koticek-za-otroke/edit", {vsebina: vsebina})
  });
});

router.post("/koticek-za-otroke", middleware.isPageEditor, upload_otroci.fields([
    {name: "vsebina[datoteka]"}, {name: "vsebina[naslovna_slika]"}]), function(req, res, next){
  Otroci_vsebina.create(req.body.vsebina, function(err, vsebina){
    if(err) {
      req.flash("error", "Prišlo je do napake pri vnosu vsebine.");
      return res.redirect("/admin/koticek-za-otroke");
    }
    if(req.files["vsebina[datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[datoteka]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };

    if(req.files["vsebina[naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[naslovna_slika]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    req.flash("success", "Vsebina dodana.");
    res.redirect("/admin/koticek-za-otroke");
  });
});

router.put("/koticek-za-otroke/:id", middleware.isPageEditor, upload_otroci.fields([
    {name: "vsebina[nova_datoteka]"}, {name: "vsebina[nova_naslovna_slika]"}]), function(req, res, next){
  Otroci_vsebina.findByIdAndUpdate(req.params.id, req.body.vsebina, function(err, vsebina){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju vsebine.");
      return res.redirect("/admin/koticek-za-otroke");
    }
    if(req.files["vsebina[nova_datoteka]"]) {
      vsebina.datoteka = req.files["vsebina[nova_datoteka]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    if(req.files["vsebina[nova_naslovna_slika]"]) {
      vsebina.naslovna_slika = req.files["vsebina[nova_naslovna_slika]"][0].originalname.replace(/[ )(]/g,'');
      vsebina.save();
    };
    req.flash("success", "Vsebina posodobljena.");
    res.redirect("/admin/koticek-za-otroke");
  });
});
// END OTROŠKI KOTIČEK

// PODSTRANI
router.get("/podstrani", middleware.isPageEditor, function(req, res){
  // prikaži vse podstrani po vrsti od nazadnje spremenjene
  Podstran.find({}).sort({datum: -1}).populate("kategorija").exec(function(err, podstrani) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    res.render("admin/podstrani/index", {podstrani: podstrani});
  })
});

router.post("/podstrani", middleware.isPageEditor, function(req, res){
  Kategorija.findById(req.body.podstran.kategorija, function(err, kategorija){
    if(err) {
      req.flash("error", "Prišlo je do napake pri kreiranju podstrani.");
      return res.redirect("/admin/podstrani");
    }
    Podstran.create(req.body.podstran, function(err, podstran){
      if(err) {
        req.flash("error", "Prišlo je do napake pri kreiranju podstrani.");
        return res.redirect("/admin/podstrani");
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
        req.flash("success", "Podstran dodana.");
        res.redirect("/admin/podstrani");
      }
    });
  });
});

router.get("/podstrani/add", middleware.isPageEditor, function(req, res){
  Kategorija.find({}, function(err, kategorije){
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/podstrani");
    }
    res.render("admin/podstrani/add", {kategorije: kategorije});
  });
});

router.put("/podstrani/:id", middleware.isPageEditor, function(req, res){
  Podstran.findByIdAndUpdate(req.params.id, req.body.podstran, function(err, podstran){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju podstrani.");
      return res.redirect("/admin/login");
    }
    Kategorija.findById(req.body.podstran.kategorija, function(err, kategorija){
      if(err) return res.render("500");
      kategorija.save();
      req.flash("success", "Podstran posodobljena.");
      res.redirect("/admin/podstrani/");
    });
  });
});

router.get("/podstrani/:id/edit", middleware.isPageEditor, function(req, res){
  Podstran.findById(req.params.id, function(err, podstran) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    Kategorija.find({}, function(err, kategorije){
      if(err) {
        req.flash("error", "Prišlo je do napake v bazi podatkov.");
        return res.redirect("/admin/login");
      }
      res.render("admin/podstrani/edit", {podstran: podstran, kategorije: kategorije});
    });
  });
});

// END PODSTRANI

// MENU
router.get("/menu", middleware.isOwner, function(req, res){
  // prikaži vse podstrani po vrsti od nazadnje spremenjene
  Kategorija.find({}, function(err, kategorije) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    Podstran.find({}, function(err, podstrani) {
      if(err) {
        req.flash("error", "Prišlo je do napake v bazi podatkov.");
        return res.redirect("/admin/login");
      };
      res.render("admin/menu/index", {kategorije: kategorije, podstrani: podstrani});
    });
  })
});

router.get("/menu/add", middleware.isOwner, function(req, res){
  res.render("admin/menu/add");
});


router.post("/menu", middleware.isOwner, function(req, res){
  Kategorija.create({naslov: req.body.naslov, url: req.body.url}, function(err, kategorija){
    if(err) {
      req.flash("error", "Prišlo je do napake pri dodajanju kategorije.");
      return res.redirect("/admin/menu");
    }
    req.flash("success", "Kategorija dodana.");
    res.redirect("/admin/menu/");
  })
});

router.get("/menu/:id/edit", middleware.isOwner, function(req, res){
  Kategorija.findById(req.params.id, function(err, kategorija){
    if(err) {
      req.flash("error", "Kategorije ne najdem v bazi podatkov.");
      return res.redirect("/admin/menu");
    };
    res.render("admin/menu/edit", {kategorija: kategorija});
  });
});

router.put("/menu/:id", middleware.isOwner, function(req, res){
  Kategorija.findByIdAndUpdate(req.params.id, {naslov: req.body.naslov, url: req.body.url}, function(err, kategorija){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju kategorije.");
      return res.redirect("/admin/menu");
    }
    req.flash("success", "Kategorija posodobljena.");
    res.redirect("/admin/menu/");
  });
});
// END MENU

// BEGIN CONTACTS
router.get("/kontakti", middleware.isAdmin, function(req, res){
  Kontakt.find({}, function(err, kontakti) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
      res.render("admin/kontakti/index", {kontakti: kontakti});
  })
});

router.get("/kontakti/add", middleware.isAdmin, function(req, res){
  res.render("admin/kontakti/add");
});

router.post("/kontakti", middleware.isAdmin, function(req, res){
  if(err) {
    req.flash("error", "Prišlo je do napake pri dodajanju kontakta.");
    return res.redirect("/admin/kontakti");
  }
  Kontakt.create(req.body.kontakt, function(err, kontakt){
    if(err) {
      req.flash("error", "Prišlo je do napake pri dodajanju kontakta.");
      return res.redirect("/admin/kontakti");
    }
    req.flash("success", "Kontaktna oseba dodana.");
    res.redirect("/admin/kontakti/");
  })
});

router.get("/kontakti/:id/edit", middleware.isAdmin, function(req, res){
  Kontakt.findById(req.params.id, function(err, kontakt){
    if(err) {
      req.flash("error", "Kontakta ne najdem v bazi podatkov.");
      return res.redirect("/admin/kontakti");
    }
    res.render("admin/kontakti/edit", {kontakt: kontakt});
  });
});

router.put("/kontakti/:id", middleware.isAdmin, function(req, res){
  Kontakt.findByIdAndUpdate(req.params.id, req.body.kontakt, function(err, kontakt) {
      if(err) {
        req.flash("error", "Prišlo je do napake pri posodabljanju kontakta.");
        return res.redirect("/admin/kontakti");
      }
      req.flash("success", "Kontaktna oseba posodobljena.");
      res.redirect("/admin/kontakti");
  })
});
// END CONTACTS

// OSKRBNICE
router.get("/oskrbnice", middleware.isAdmin, function(req, res){
  Oskrbnica.find({}, function(err, oskrbnice) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
      res.render("admin/oskrbnice/index", {oskrbnice: oskrbnice});
  })
});

router.get("/oskrbnice/add", middleware.isAdmin, function(req, res){
  res.render("admin/oskrbnice/add");
});

router.post("/oskrbnice", middleware.isAdmin, function(req, res){
  Oskrbnica.create(req.body.oskrbnica, function(err, oskrbnica){
    if(err) {
      req.flash("error", "Prišlo je do napake pri dodajanju.");
      return res.redirect("/admin/oskrbnice");
    }
    req.flash("success", "Oskrbnica dodana.");
    res.redirect("/admin/oskrbnice/");
  })
});

router.get("/oskrbnice/:id/edit", middleware.isAdmin, function(req, res){
  Oskrbnica.findById(req.params.id, function(err, oskrbnica){
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/oskrbnice");
    }
    res.render("admin/oskrbnice/edit", {oskrbnica: oskrbnica});
  });
});

router.put("/oskrbnice/:id", middleware.isAdmin, function(req, res){
  Oskrbnica.findByIdAndUpdate(req.params.id, req.body.oskrbnica, function(err, oskrbnica) {
      if(err) {
        req.flash("error", "Prišlo je do napake pri posodabljanju podatkov.");
        return res.redirect("/admin/oskrbnice");
      }
      req.flash("success", "Oskrbnica posodobljena.");
      res.redirect("/admin/oskrbnice");
  })
});
// END OSKRBNICE

// BEGIN USERS
router.get("/users", middleware.isAdmin, function(req, res){
  User.find({}, function(err, users) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
      res.render("admin/users/index", {users: users});
  })
});

router.get("/users/add", middleware.isAdmin, function(req, res){
  res.render("admin/users/add");
});

router.post("/users", middleware.isAdmin, function(req, res){
  var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            adminLevel: req.body.adminLevel
        });
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/admin/users/add");
    }
    req.flash("success", "Nov " + user.adminLevel + " dodan.");
    res.redirect("/admin/users/");
  })
});

router.get("/users/:id/edit", middleware.isAdmin, function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err) {
      req.flash("error", err.message);
      return res.redirect("/admin/users");
    }
    res.render("admin/users/edit", {user: user});
  });
});

router.put("/users/:id", middleware.isAdmin, function(req, res){
  var userData = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            adminLevel: req.body.adminLevel
        };
  User.findByIdAndUpdate(req.params.id, userData, function(err, user) {
      if(err) {
        req.flash("error", err.message);
        return res.redirect("/admin/users");
      }
      req.flash("success", "Uporabnik posodobljen.");
      res.redirect("/admin/users");
  });
});
// END USERS

// BEGIN PROFIL UPORABNIKA
router.get("/profil", middleware.isLoggedIn, function(req, res){
  res.render("admin/profil", {user: req.user});
});

router.get("/profil/geslo", middleware.isLoggedIn, function(req, res){
  res.render("admin/profil/geslo", {user: req.user});
});

router.put("/profil/:id", middleware.isLoggedIn, function(req, res){
  var userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };
  User.findByIdAndUpdate(req.params.id, userData, function(err, user) {
      if(err) {
        req.flash("error", err.message);
        return res.redirect("/admin/users");
      }
      req.flash("success", "Uporabnik posodobljen.");
      res.redirect("/admin/users");
  });
});

// sprememba gesla
router.put("/profil/geslo/:id", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi.");
      return res.redirect("/admin/profil");
    }

    if(req.body.newPassword === req.body.confirm) {
      user.changePassword(req.body.oldPassword, req.body.newPassword, function(err){
        if(err) {
          req.flash("error", "Staro geslo ni pravilno.");
          return res.redirect("/admin/profil/geslo");
        }
        req.flash("success", "Geslo spremenjeno.");
        res.redirect("/admin/muce/iscejo");
      });
    } else {
      req.flash("error", "Novi gesli se ne ujemata.");
      return res.redirect("/admin/profil/geslo");
    }

  });
});
// END PROFIL UPORABNIKA


// BEGIN SPREMEMBA POZABLJENEGA GESLA
router.get('/forgot', function(req, res) {
  res.render('admin/forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
          if(err) {
              req.flash('error', 'Nekaj je šlo narobe.');
              return res.redirect('back');
          }
          if (!user) {
          req.flash('error', 'Uporabnik s tem e-mail naslovom ne obstaja.');
          return res.redirect('/admin/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'mail.macjahisa.si',
        port: 26,
        secure: false,
        tls: {
          rejectUnauthorized:false
        },
        auth: {
            user: process.env.NOTIF_MAIL,
            pass: process.env.NOTIF_MAIL_PW
        }
      });

      var link = "http://207.154.195.5:3001/admin/reset/" + token;

      var mailOptions = {
        to: user.email,
        from: process.env.NOTIF_MAIL,
        subject: 'Mačja hiša CMS - Sprememba gesla',
        text: 'Vi (ali nekdo drug) je zahteval ponastavitev vašega gesla za administrativno (CMS) stran Mačje hiše.\n\n' +
          'Postopek lahko zaključite z uporabo spodnje povezave:\n\n' +
          'http://207.154.195.5:3001/admin/reset/' + token + '\n\n' +
          'Če ponastavitve gesla niste zahtevali, lahko to sporočilo ignorirate.\n',
        html: "<p>Vi (ali nekdo drug) je zahteval ponastavitev vašega gesla za administrativno (CMS) stran Mačje hiše.</p><p>Postopek lahko zaključite z uporabo spodnje povezave:</p><p><a href='" + link + "' target='_blank'>" + link + "</a></p><p>Če ponastavitve gesla niste zahtevali, lahko to sporočilo ignorirate.</p>"
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Navodila za ponastavitev gesla so bila poslana na e-mail naslov ' + user.email + '.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/admin/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(err) {
      req.flash('error', 'Nekaj je šlo narobe.');
      return res.redirect('back');
    }
    if (!user) {
      req.flash('error', 'Žeton za ponastavitev gesla je napačen ali pa ni več aktiven.');
      return res.redirect('/admin/forgot');
    }
    res.render('admin/reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if(err) {
          req.flash('error', 'Nekaj je šlo narobe.');
          return res.redirect('back');
        }
        if (!user) {
          req.flash('error', 'Žeton za ponastavitev gesla je napačen ali pa ni več aktiven.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            if(err) {
              req.flash('error', 'Nekaj je šlo narobe.');
              return res.redirect('back');
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                if(err) {
                  req.flash('error', 'Nekaj je šlo narobe.');
                  return res.redirect('back');
                }
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Gesli se ne ujemata.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'mail.macjahisa.si',
        port: 26,
        secure: false,
        tls: {
          rejectUnauthorized:false
        },
        auth: {
            user: process.env.NOTIF_MAIL,
            pass: process.env.NOTIF_MAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.NOTIF_MAIL,
        subject: 'Vaše geslo za administrativno stran (CMS) Mačja hiša je bilo spremenjeno',
        text: 'Obveščamo vas, da je bilo geslo za račun z e-mail naslovom ' + user.email + ' ravnokar spremenjeno.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Geslo je bilo uspešno spremenjeno.');
        done(err);
      });
    }
  ], function(err) {
        if(err) {
          req.flash('error', 'Nekaj je šlo narobe.');
          return res.redirect('back');
        }
    res.redirect('/admin/muce/iscejo');
  });
});
// END SPREMEMBA POZABLJENEGA GESLA

// NASLOVNICE
router.get("/naslovnice", middleware.isPageEditor, function(req, res){
  // prikaži vse vsebine po vrsti od nazadnje spremenjene
  Naslovnica.find({}, function(err, naslovnice) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }
    // preglej katere so aktivne
    var prva;
    var druga;
    var tretja;

    naslovnice.map(function(naslovnica){
      if(naslovnica.pozicija === 1) {
        prva = naslovnica;
      };
      if(naslovnica.pozicija === 2) {
        druga = naslovnica;
      };
      if(naslovnica.pozicija === 3) {
        tretja = naslovnica;
      };
    });

    res.render("admin/naslovnice/index",
      {
        naslovnice: naslovnice,
        prva: prva,
        druga: druga,
        tretja: tretja
      }
    );
  })
});

router.get("/naslovnice/add", middleware.isPageEditor, function(req, res){
  res.render("admin/naslovnice/add");
});

router.get("/naslovnice/:id/edit", middleware.isPageEditor, function(req, res){
  Naslovnica.findById(req.params.id, function(err, naslovnica){
    if(err) {
      req.flash("error", "Naslovnice ne najdem v bazi podatkov.");
      return res.redirect("/admin/naslovnice");
    }
    res.render("admin/naslovnice/edit", {naslovnica: naslovnica})
  });
});

router.post("/naslovnice/:id/deactivate", middleware.isPageEditor, function(req, res){
  Naslovnica.findById(req.params.id, function(err, naslovnica){
    if(err) {
      req.flash("error", "Naslovnice ne najdem v bazi podatkov.");
      return res.redirect("/admin/naslovnice");
    }
    naslovnica.pozicija = 0;
    naslovnica.save(function (err) {
      if (err) return handleError(err);
      // saved!
    });
    req.flash("success", "Naslovnica deaktivirana.");
    return res.redirect("/admin/naslovnice");
  });
});

router.post("/naslovnice", middleware.isPageEditor, upload_naslovnice.single("naslovnica[ozadje]"), function(req, res, next){
  Naslovnica.count({}, function(err, count){
    if(err) {
      req.flash("error", "Prišlo je do napake pri kreiranju naslovnice.");
      return res.redirect("/admin/naslovnice");
    }
    Naslovnica.create(req.body.naslovnica, function(err, naslovnica){
      if(err) {
        req.flash("error", "Prišlo je do napake pri kreiranju naslovnice.");
        return res.redirect("/admin/naslovnice");
      }

      var dbid = count + 1;
      naslovnica.dbid = dbid;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });

      naslovnica.cssBackgroundPositionVertical = req.body.rangeInput;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });


      if(req.file) {
        // var ozadje = "naslovnica_" + dbid + "." + req.file.mimetype.split("/")[1];
        naslovnica.ozadje = req.file.filename.replace(/[ )(]/g,'');
        naslovnica.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }

      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
      req.flash("success", "Naslovnica dodana.");
      res.redirect("/admin/naslovnice");
    });
  });
});

router.put("/naslovnice/:id", middleware.isPageEditor, upload_naslovnice.single("naslovnica[ozadje]"), function(req, res, next){
  Naslovnica.findByIdAndUpdate(req.params.id, req.body.naslovnica, function(err, naslovnica){
    if(err) {
      req.flash("error", "Prišlo je do napake pri posodabljanju naslovnice.");
      return res.redirect("/admin/naslovnice");
    }

    if(req.file) {
      var ozadje = req.file.filename.replace(/[ )(]/g,'');
      naslovnica.ozadje = ozadje;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
    }

    if(req.body.externalURL === "on") {
      naslovnica.externalURL = true;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
    } else {
      naslovnica.externalURL = false;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
    }

      naslovnica.cssBackgroundPositionVertical = req.body.rangeInput;
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });

      naslovnica.datum = Date.now();
      naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
      req.flash("success", "Naslovnica posodobljena.");
      res.redirect("/admin/naslovnice/");
  });
});

router.post("/naslovnice/:pozicija/:id", middleware.isPageEditor, function(req, res, next){
  Naslovnica.find({}, function(err, naslovnice) {
    if(err) {
      req.flash("error", "Prišlo je do napake v bazi podatkov.");
      return res.redirect("/admin/login");
    }

    // umakni pozicijo pri dosedanji naslovnici
    naslovnice.map(function(dosedanja_naslovnica){
      if(dosedanja_naslovnica.pozicija === Number(req.params.pozicija)) {
        dosedanja_naslovnica.pozicija = 0;
        dosedanja_naslovnica.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      }
    });

    // najdi novo in dodeli pozicijo
    Naslovnica.findById(req.params.id, function(err, nova_naslovnica) {
      nova_naslovnica.pozicija = Number(req.params.pozicija);
      nova_naslovnica.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
      req.flash("success", "Naslovnice na prvi strani posodobljene.");
      res.send({redirect: '/admin/naslovnice'});
    });
  });
});

// END NASLOVNICE

module.exports = router;
