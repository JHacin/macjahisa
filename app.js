require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
require('mongoose-query-random'); // needed for the query.random() @ index route
const flash = require('connect-flash');
const compression = require('compression');
const expressSession = require('express-session');

const Muca = require('./models/muca');
const Kategorija = require('./models/kategorija');
const Podstran = require('./models/podstran');
const User = require('./models/user');
const Naslovnica = require('./models/naslovnica');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './node_modules')));

app.use(compression());
app.use(helmet());
app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

app.locals.moment = require('moment');
app.locals.deployVersion = new Date().getTime();
app.locals.siteConfig = require('./config/config');

app.use(
    expressSession({
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

app.use((req, res, next) => {
    const protocol = 'http' + req.secure ? 's' : '' + '://';
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.social_url = protocol + req.headers.host + req.originalUrl;
    res.locals.social_image_default = protocol + req.headers.host + '/files/page/social_default.png';
    next();
});

mongoose.connect('mongodb://localhost/macjahisa' || process.env.DATABASE);

// find all categories and subpages (for navigation menu), cats and news (for sidebar)
app.use('*', (req, res, next) => {
    Kategorija.find({}, (err, kategorije) => {
        if (err) {
            return res.render('500');
        }
        Podstran.find({}, (err, podstrani) => {
            if (err) {
                return res.render('500');
            }
            Muca.find()
                .where('status')
                .in([1, 2])
                .sort({ datum: -1 })
                .random(3, true, (err, sidebar_muce) => {
                    if (err) {
                        return res.render('500');
                    }
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

app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile('sitemap.xml');
});

app.get('/oglasi_xml_bolha.xml', (req, res) => {
    console.log('hi');
    res.type('application/xml');
    res.sendFile(__dirname + '/oglasi_xml_bolha.xml');
});

app.get('/oglasi_xml_salomon.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(__dirname + '/oglasi_xml_salomon.xml');
});

app.get('/', (req, res) => {
    Muca.find()
        .where('status')
        .in([1, 2])
        .random(4, true, (err, muce) => {
            if (err) {
                return res.render('500');
            }
            Muca.where('status')
                .in([1, 2])
                .count()
                .exec((err, count) => {
                    if (err) {
                        return res.render('500');
                    }
                    Naslovnica.find()
                        .where('pozicija')
                        .in([1, 2, 3])
                        .exec((err, naslovnice) => {
                            if (err) {
                                return res.render('500');
                            }

                            const aktiviraneNaslovnice = naslovnice
                                .filter(n => n.pozicija)
                                .sort((a, b) => a.pozicija > b.pozicija ? 1 : -1);

                            res.render('index', {
                                nav_kategorije: req.nav_kategorije,
                                nav_podstrani: req.nav_podstrani,
                                title: 'Mačja hiša - skupaj pomagamo brezdomnim mucam',
                                muce: muce,
                                steviloMucKiIscejoDom: count,
                                naslovnice: aktiviraneNaslovnice,
                                hasCustomMetaData: false,
                                needsSlickSlider: true,
                            });
                        });
                });
        });
});

app.get('/zasebnost', (req, res) => {
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

app.use((req, res) => {
    res.status(400);
    res.render('404');
});

app.use((error, req, res) => {
    res.status(500);
    console.log(error);
    res.render('500');
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('Starting.');
});
