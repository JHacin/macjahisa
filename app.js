var express             = require("express"),
    ejs                 = require("ejs"),
    mongoose            = require("mongoose"),
    mongooseQueryRandom = require("mongoose-query-random"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    moment              = require("moment"),
    methodOverride      = require("method-override"),
    Novica              = require("./models/novica"),
    Muca                = require("./models/muca"),
    Kategorija          = require("./models/kategorija"),
    Clanek              = require("./models/clanek"),
    Podstran            = require("./models/podstran");

// Route handling vars
var o_nas = require("./routes/o_nas.js");
var posvojitev = require("./routes/posvojitev.js");
var dobro_je_vedeti = require("./routes/dobro_je_vedeti.js");
var pomoc = require("./routes/pomoc.js");
var projekt_vita = require("./routes/projekt_vita.js");
var admin = require("./routes/admin.js");
var novice = require("./routes/novice.js");
var v_novem_domu = require("./routes/v_novem_domu.js");

// CONFIG
mongoose.connect("mongodb://localhost/macjahisa");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.locals.moment = require('moment');

// find all categories and subpages (for navigation menu), cats and news (for sidebar)
app.use("*", function(req, res, next) {
  Kategorija.find({}, function(err, kategorije){
    if(err) return console.log(err);
    Podstran.find({}, function(err, podstrani){
      if(err) return console.log(err);
      Muca.find().where("status").in([1, 2]).sort({datum: -1}).random(3, true, function(err, sidebar_muce) {
        if(err) return console.log(err);
        Novica.find().where("objava").equals("1").sort({datum: -1}).limit(4).exec(function(err, sidebar_novice) {
            if(err) return console.log(err);
            req.nav_kategorije = kategorije;
            req.nav_podstrani = podstrani;
            req.sidebar_muce = sidebar_muce;
            req.sidebar_novice = sidebar_novice;
            search = podstrani;
            next();
        });
      });
    });
  });
});

// INDEX ROUTE
app.get("/", function(req, res){
  Novica.find().where("objava").equals("1").sort({datum: -1}).limit(3).exec(function(err, novice) {
    if(err) return console.log(err);
    Muca.find().where("status").in([1, 2]).random(4, true, function(err, muce){
      if(err) return console.log(err);
      res.render("index", {nav_kategorije: req.nav_kategorije, nav_podstrani: req.nav_podstrani,
          title: "Mačja hiša - skupaj pomagamo brezdomnim mucam", novice: novice, muce: muce
      });
    });
  });
});

app.get("/search", function(req, res){
  res.render("search", {title: "Rezultati iskanja | Mačja hiša", nav_kategorije: req.nav_kategorije,
  nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
  sidebar_muce: req.sidebar_muce});
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
app.use("/novice/", novice);
app.use("/v_novem_domu/", v_novem_domu);

// app listen config
app.listen(process.env.PORT || 3001, process.env.IP, function(){
    console.log("Starting.");
});
