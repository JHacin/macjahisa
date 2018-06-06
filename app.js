require('dotenv').config();

var express             = require("express"),
    ejs                 = require("ejs"),
    mongoose            = require("mongoose"),
    mongooseQueryRandom = require("mongoose-query-random"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    moment              = require("moment"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override");

var Muca                = require("./models/muca"),
    Kategorija          = require("./models/kategorija"),
    Clanek              = require("./models/clanek"),
    Podstran            = require("./models/podstran"),
    User                = require("./models/user");
    Naslovnica          = require("./models/naslovnica");

// Route handling vars
var o_nas = require("./routes/o_nas.js");
var posvojitev = require("./routes/posvojitev.js");
var dobro_je_vedeti = require("./routes/dobro_je_vedeti.js");
var pomoc = require("./routes/pomoc.js");
var projekt_vita = require("./routes/projekt_vita.js");
var admin = require("./routes/admin.js");
var v_novem_domu = require("./routes/v_novem_domu.js");

// CONFIG
mongoose.connect("mongodb://localhost/macjahisa" || process.env.DATABASE);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json({limit: "1tb"}));
app.use(bodyParser.urlencoded({limit: "1tb", extended: true, parameterLimit:50000}));
app.use(flash());
app.locals.moment = require('moment');

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "mew",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser            = req.user;
    res.locals.error                  = req.flash("error");
    res.locals.success                = req.flash("success");
    res.locals.social_url             = "http://" + req.headers.host + req.originalUrl;
    res.locals.social_image_default   = "http://" + req.headers.host + "/files/page/social_default.png";
    next();
});
// END PASSPORT CONFIG

// find all categories and subpages (for navigation menu), cats and news (for sidebar)
app.use("*", function(req, res, next) {
  Kategorija.find({}, function(err, kategorije){
    if(err) return console.log(err);
    Podstran.find({}, function(err, podstrani){
      if(err) return console.log(err);
      Muca.find().where("status").in([1, 2]).sort({datum: -1}).random(3, true, function(err, sidebar_muce) {
        if(err) return console.log(err);
            if(err) return console.log(err);
            req.nav_kategorije = kategorije;
            req.nav_podstrani = podstrani;
            req.sidebar_muce = sidebar_muce;
            next();
      });
    });
  });
});

// poprava imen (ki vključejejo nepotreben CAPS LOCK)
// Muca.find({}, function(err, muce){
//   muce.forEach(function(muca){
//     var ime = muca.ime;
//     ime = ime.toLowerCase();
//     ime = ime.charAt(0).toUpperCase() + ime.slice(1);
//     if(ime.indexOf(" in ") != -1) {
//       var index = ime.indexOf(" in ");
//       ime = ime.substring(0, index + 4) + ime.charAt(index + 4).toUpperCase() + ime.slice(index + 5);
//     };
//     muca.ime = ime;
//     muca.save(function(err, muca){
//       if(err) return console.log(err);
//     });
//   });
// });

// poprava člankov brez tipov/kategorij
// Clanek.find({}, function(err, clanki) {
//   clanki.forEach(function(clanek) {
//     if (!clanek.tip) {
//       clanek.tip = "besedilo";
//       clanek.save(function(err, shranjenClanek){
//         if(err) return console.log(err);
//       });
//     }
//   });
// });

// INDEX ROUTE
app.get("/", function(req, res){
  Muca.find().where("status").in([1, 2]).random(4, true, function(err, muce){
    if(err) return console.log(err);
    Muca.where("status").in([1, 2]).count().exec(function(err, count){
        var steviloMuc = count;
        if(err) return console.log(err);
        Naslovnica.find().where("pozicija").in([1, 2, 3]).exec(function(err, naslovnice){
          if(err) return console.log(err);

          var aktiviraneNaslovnice = [];
            naslovnice.map(function(naslovnica){
              if(naslovnica.pozicija === 1) {
                aktiviraneNaslovnice.push(naslovnica);
              };
            });

            naslovnice.map(function(naslovnica){
              if(naslovnica.pozicija === 2) {
                aktiviraneNaslovnice.push(naslovnica);
                };
            });

            naslovnice.map(function(naslovnica){
              if(naslovnica.pozicija === 3) {
                aktiviraneNaslovnice.push(naslovnica);
              };
            });
          res.render("index",
          {
            nav_kategorije: req.nav_kategorije,
            nav_podstrani: req.nav_podstrani,
            title: "Mačja hiša - skupaj pomagamo brezdomnim mucam",
            muce: muce,
            steviloMucKiIscejoDom: steviloMuc,
            naslovnice: aktiviraneNaslovnice
          });
        });
      });
    });
  });

// Muca.find({}, function(err, clanki){
//   if(err) console.log(err);
//   var id = 1;
//   clanki.forEach(function(clanek){
//     clanek.dbid = id;
//     clanek.save().then(function (result) {
//   // promise was "resolved" successfully
// }, function (err) {
//   console.log(err);
//   // Promise was "rejected"
// });
//     id++;
//   });
// });

// OTHER routes
app.use("/o_nas/", o_nas);
app.use("/posvojitev/", posvojitev);
app.use("/dobro_je_vedeti/", dobro_je_vedeti);
app.use("/pomoc/", pomoc);
app.use("/projekt_vita/", projekt_vita);
app.use("/admin/", admin);
app.use("/v_novem_domu/", v_novem_domu);

// app listen config
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Starting.");
});
