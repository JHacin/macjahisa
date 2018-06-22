require('dotenv').config();

var compression         = require("compression"),
    express             = require("express"),
    minify              = require("express-minify"),
    helmet              = require("helmet"),
    ejs                 = require("ejs"),
    mongoose            = require("mongoose"),
    mongooseQueryRandom = require("mongoose-query-random"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    moment              = require("moment"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override"),
    maintenance         = require("maintenance");
    // ckEditor            = require( '@ckeditor/ckeditor5-build-classic' );

var Muca                = require("./models/muca"),
    Kategorija          = require("./models/kategorija"),
    Clanek              = require("./models/clanek"),
    Podstran            = require("./models/podstran"),
    User                = require("./models/user");
    Naslovnica          = require("./models/naslovnica");

// Route handling vars
var o_nas = require("./routes/o-nas.js");
var posvojitev = require("./routes/posvojitev.js");
var dobro_je_vedeti = require("./routes/dobro-je-vedeti.js");
var pomoc = require("./routes/pomoc.js");
var projekt_vita = require("./routes/projekt-vita.js");
var admin = require("./routes/admin.js");
var v_novem_domu = require("./routes/v-novem-domu.js");

// CONFIG
app.use(compression());
app.use(function(req, res, next)
{
  if (/\.min\.(css|js)$/.test(req.url)) {
    res.minifyOptions = res.minifyOptions || {};
    res.minifyOptions.minify = false;
  }
  next();
});
app.use(minify({
  cache: __dirname + "/cache",
  jsMatch: /js/,
  cssMatch: /css/,
}));
app.use(helmet());
mongoose.connect("mongodb://localhost/macjahisa" || process.env.DATABASE);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public", { maxAge: 31557600 }));
app.use(express.static(__dirname + "./node_modules"));
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
    if(err) return res.render("500");
    Podstran.find({}, function(err, podstrani){
      if(err) return res.render("500");
      Muca.find().where("status").in([1, 2]).sort({datum: -1}).random(3, true, function(err, sidebar_muce) {
        if(err) return res.render("500");
            if(err) return res.render("500");
            req.nav_kategorije = kategorije;
            req.nav_podstrani = podstrani;
            req.sidebar_muce = sidebar_muce;
            next();
      });
    });
  });
});

// poprava člankov brez tipov/kategorij
// Clanek.find({}, function(err, clanki) {
//   var count = 0;
//   clanki.forEach(function(clanek) {
//     count++;
//     clanek.dbid = count;
//
//     clanek.save(function(err, shranjenClanek){
//             if(err) return res.render("500");
//           });
//           console.log(clanek.dbid);
//     if (!clanek.tip) {
//       clanek.tip = "besedilo";
//       clanek.save(function(err, shranjenClanek){
//         if(err) return res.render("500");
//       });
//     }
//   });
  // Clanek.count({}, function(err, count){
  //
  // });
// });

// app.get('/', function (req, res) {
// 	console.log(req.url);
// 	res.render("maintenance");
// });

var options = {
	current: true,						// current state, default **false**
	httpEndpoint: true,					// expose http endpoint for hot-switch, default **false**,
	url: '/app/mt',						// if `httpEndpoint` is on, customize endpoint url, default **'/maintenance'**
	accessKey: 'xx4zUU8Cyy7',			// token that client send to authorize, if not defined `access_key` is not used
	view: 'maintenance',				// view to render on maintenance, default **'maintenance.html'**
	api: '/api',						// for rest API, species root URL to apply, default **undefined**
	status: 503,						// status code for response, default **503**
	message: 'Takoj bomo nazaj'				// response message, default **'sorry, we are on maintenance'**
};

// maintenance(app, options);

app.get("/sitemap.xml", function(req, res){
  res.type("application/xml");
  res.sendFile('sitemap.xml');
});

// INDEX ROUTE
app.get("/", function(req, res){
  Muca.find().where("status").in([1, 2]).random(4, true, function(err, muce){
    if(err) return res.render("500");
    Muca.where("status").in([1, 2]).count().exec(function(err, count){
        var steviloMuc = count;
        if(err) return res.render("500");
        Naslovnica.find().where("pozicija").in([1, 2, 3]).exec(function(err, naslovnice){
          if(err) return res.render("500");

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
            naslovnice: aktiviraneNaslovnice,
            isIndexPage: true,
            hasCustomMetaData: false,
            needsSlickSlider: true
          });
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
//       if(err) return res.render("500");
//     });
//     console.log(muca.SEOmetaTitle);
//     muca.SEOmetaTitle = muca.ime + " | Mačja hiša";
//     muca.SEOfbTitle = muca.ime + " | Mačja hiša";
//     muca.SEOtwitterTitle = muca.ime + " | Mačja hiša";
//     muca.save(function(err, muca){
//       if(err) return res.render("500");
//     });
//   });
// });

// mucam potalaj dbIDje
// Muca.find({}, function(err, muce){
//   if(err) console.log(err);
//   var id = 1;
//   muce.forEach(function(muca){
//     muca.dbid = id;
//     muca.save().then(function (result) {
//   // promise was "resolved" successfully
// }, function (err) {
//   console.log(err);
//   // Promise was "rejected"
// });
//     id++;
//   });
// });

// Dodaj SEO podatke pri entitetah, ki jih imajo prazne
  // Muca.find({}, function(err, muce) {
  //   muce.forEach(function(muca) {
  //     // if(muca.SEOmetaDescription == "") {
  //       muca.SEOmetaDescription = muca.opis.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       muca.SEOfbDescription = muca.opis.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       muca.SEOtwitterDescription = muca.opis.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       muca.SEOmetaTitle = muca.ime + " | Mačja hiša";
  //       muca.SEOfbTitle = muca.ime + " | Mačja hiša";
  //       muca.SEOtwitterTitle = muca.ime + " | Mačja hiša";
  //       muca.save();
  //     // }
  //   });
  // });
  // Clanek.find({tip: "besedilo"}, function(err, clanki) {
  //   clanki.forEach(function(clanek) {
  //     // if(clanek.SEOmetaDescription == "") {
  //       clanek.SEOmetaDescription = clanek.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       clanek.SEOfbDescription = clanek.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       clanek.SEOtwitterDescription = clanek.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       clanek.SEOmetaTitle = clanek.naslov + " | Mačja hiša";
  //       clanek.SEOfbTitle = clanek.naslov + " | Mačja hiša";
  //       clanek.SEOtwitterTitle = clanek.naslov + " | Mačja hiša";
  //       clanek.save();
  //     // }
  //   });
  // });
  // Podstran.find({}, function(err, podstrani) {
  //   podstrani.forEach(function(podstran) {
  //     // if(podstran.SEOmetaDescription == "") {
  //       podstran.SEOmetaDescription = podstran.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       podstran.SEOfbDescription = podstran.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       podstran.SEOtwitterDescription = podstran.vsebina.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 300);
  //       podstran.SEOmetaTitle = podstran.naslov + " | Mačja hiša";
  //       podstran.SEOfbTitle = podstran.naslov + " | Mačja hiša";
  //       podstran.SEOtwitterTitle = podstran.naslov + " | Mačja hiša";
  //       podstran.save();
  //     // }
  //   });
  // });



app.get("/zasebnost", function(req, res) {
  res.redirect("o-nas/zasebnost");
});

// OTHER routes
app.use("/o-nas/", o_nas);
app.use("/posvojitev/", posvojitev);
app.use("/dobro-je-vedeti/", dobro_je_vedeti);
app.use("/pomoc/", pomoc);
app.use("/projekt-vita/", projekt_vita);
app.use("/admin/", admin);
app.use("/v-novem-domu/", v_novem_domu);

app.use(function(req, res) {
    res.status(400);
    res.render("404");
  });

  // Handle 500
  app.use(function(error, req, res, next) {
     res.status(500);
     res.render("500");
  });

// app listen config
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Starting.");
});
