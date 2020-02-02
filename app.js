require('dotenv').config();

const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('mongoose-query-random'); // needed for the query.random() @ index route
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const Muca = require('./models/muca');
const Kategorija = require('./models/kategorija');
const Podstran = require('./models/podstran');
const User = require('./models/user');
const Naslovnica = require('./models/naslovnica');

app.use(compression());
app.use(helmet());
mongoose.connect('mongodb://localhost/macjahisa' || process.env.DATABASE);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static('./node_modules'));
app.use(methodOverride('_method'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
app.use(flash());
app.locals.moment = require('moment');
app.locals.deployVersion = new Date().getTime();
app.locals.siteConfig = require('./config/config');

app.use(
    require('express-session')({
        secret: 'mew',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.social_url = 'http://' + req.headers.host + req.originalUrl;
    res.locals.social_image_default =
        'http://' + req.headers.host + '/files/page/social_default.png';
    next();
});

// find all categories and subpages (for navigation menu), cats and news (for sidebar)
app.use('*', function(req, res, next) {
    Kategorija.find({}, function(err, kategorije) {
        if (err) return res.render('500');
        Podstran.find({}, function(err, podstrani) {
            if (err) return res.render('500');
            Muca.find()
                .where('status')
                .in([1, 2])
                .sort({ datum: -1 })
                .random(3, true, function(err, sidebar_muce) {
                    if (err) return res.render('500');
                    if (err) return res.render('500');
                    req.nav_kategorije = kategorije;
                    req.nav_podstrani = podstrani;
                    req.sidebar_muce = sidebar_muce;
                    next();
                });
        });
    });
});

// MAINTENANCE MODE
// app.get('/admin', function(req, res) {
//   if(req.isAuthenticated()){
//       res.redirect("admin/muce/iscejo");
//   } else {
//     res.render("admin/login");
//   }
// });
//
// app.get('/admin/login', function(req, res) {
//   if(req.isAuthenticated()){
//       res.redirect("admin/muce/iscejo");
//   } else {
//     res.render("admin/login");
//   }
// });
//
// app.post("/admin/login", passport.authenticate("local",
//     {
//         successRedirect: "/admin/muce/iscejo",
//         failureRedirect: "/admin/login"
//     }), function(req, res) {
// });
//
// app.use('*', middleware.isLoggedInWhenUnderMaintenance);

app.get('/sitemap.xml', function(req, res) {
    res.type('application/xml');
    res.sendFile('sitemap.xml');
});

app.get('/oglasi_xml_bolha.xml', function(req, res) {
    console.log('hi');
    res.type('application/xml');
    res.sendFile(__dirname + '/oglasi_xml_bolha.xml');
});

app.get('/oglasi_xml_salomon.xml', function(req, res) {
    res.type('application/xml');
    res.sendFile(__dirname + '/oglasi_xml_salomon.xml');
});

app.get('/', function(req, res) {
    Muca.find()
        .where('status')
        .in([1, 2])
        .random(4, true, function(err, muce) {
            if (err) return res.render('500');
            Muca.where('status')
                .in([1, 2])
                .count()
                .exec(function(err, count) {
                    var steviloMuc = count;
                    if (err) return res.render('500');
                    Naslovnica.find()
                        .where('pozicija')
                        .in([1, 2, 3])
                        .exec(function(err, naslovnice) {
                            if (err) return res.render('500');

                            var aktiviraneNaslovnice = [];
                            naslovnice.map(function(naslovnica) {
                                if (naslovnica.pozicija === 1) {
                                    aktiviraneNaslovnice.push(naslovnica);
                                }
                            });

                            naslovnice.map(function(naslovnica) {
                                if (naslovnica.pozicija === 2) {
                                    aktiviraneNaslovnice.push(naslovnica);
                                }
                            });

                            naslovnice.map(function(naslovnica) {
                                if (naslovnica.pozicija === 3) {
                                    aktiviraneNaslovnice.push(naslovnica);
                                }
                            });
                            res.render('index', {
                                nav_kategorije: req.nav_kategorije,
                                nav_podstrani: req.nav_podstrani,
                                title: 'Mačja hiša - skupaj pomagamo brezdomnim mucam',
                                muce: muce,
                                steviloMucKiIscejoDom: steviloMuc,
                                naslovnice: aktiviraneNaslovnice,
                                isIndexPage: true,
                                hasCustomMetaData: false,
                                needsSlickSlider: true,
                            });
                        });
                });
        });
});

app.get('/zasebnost', function(req, res) {
    res.redirect('o-nas/zasebnost');
});

app.use('/', require('./routes/redirects.js'));
app.use('/o-nas/', require('./routes/o-nas.js'));
app.use('/posvojitev/', require('./routes/posvojitev.js'));
app.use('/dobro-je-vedeti/', require('./routes/dobro-je-vedeti.js'));
app.use('/pomoc/', require('./routes/pomoc.js'));
app.use('/projekt-vita/', require('./routes/projekt-vita.js'));
app.use('/admin/', require('./routes/admin.js'));
app.use('/v-novem-domu/', require('./routes/v-novem-domu.js'));

app.use(function(req, res) {
    res.status(400);
    res.render('404');
});

app.use(function(error, req, res, next) {
    res.status(500);
    console.log(error);
    res.render('500');
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log('Starting.');
});
