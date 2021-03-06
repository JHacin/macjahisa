const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');
const Clanek = require('../models/clanek');
const Izobrazevalna_vsebina = require('../models/izobrazevalna_vsebina');
const Otroci_vsebina = require('../models/otroci_vsebina');
const { renderGenericPage } = require('./util');

router.get('/', function(req, res) {
    res.redirect('/dobro-je-vedeti/zbirka-macje-hise');
});

router.get('/zbirka-macje-hise', function(req, res) {
    Podstran.findOne({ naslov: 'Zbirka Mačje hiše' }, function(err, podstran) {
        if (err) {
            return res.render('500');
        }
        Izobrazevalna_vsebina.find({ kategorija: 'zbirka-macje-hise', objava: '1' })
            .sort({ datum: -1 })
            .exec(function(err, vsebine) {
                res.render('dobro-je-vedeti/izobrazevalne-vsebine', {
                    title: 'Zbirka Mačje hiše | Mačja hiša',
                    podstran: podstran,
                    vsebine: vsebine,
                });
            });
    });
});

router.get('/letaki', function(req, res) {
    Podstran.findOne({ naslov: 'Letaki' }, function(err, podstran) {
        if (err) {
            return res.render('500');
        }
        Izobrazevalna_vsebina.find({ kategorija: 'letaki', objava: '1' })
            .sort({ datum: -1 })
            .exec(function(err, vsebine) {
                res.render('dobro-je-vedeti/izobrazevalne-vsebine', {
                    title: 'Letaki | Mačja hiša',
                    podstran: podstran,
                    vsebine: vsebine,
                });
            });
    });
});

router.get('/prispevki-clanki-povezave', (req, res) => {
    Podstran.findOne({ naslov: 'Prispevki, članki, povezave' }, (err, podstran) => {
        if (err) {
            return res.render('500');
        }

        Clanek.find({ objava: '1' }, (err, clanki) => {
            if (err) {
                return res.render('500');
            }
            res.render('dobro-je-vedeti/prispevki-clanki-povezave', {
                sidebar_muce: req.sidebar_muce,
                title: 'Prispevki, članki, povezave | Mačja hiša',
                podstran: podstran,
                prispevki: clanki.filter(clanek => clanek.kategorija === 'prispevki'),
                nasveti: clanki.filter(clanek => clanek.kategorija === 'nasveti'),
                zdravje: clanki.filter(clanek => clanek.kategorija === 'zdravje'),
                zakonodaja: clanki.filter(clanek => clanek.kategorija === 'zakonodaja'),
            });
        });
    });
});

router.get('/prispevki-clanki-povezave/:id', (req, res) => {
    Clanek.findOne({ dbid: req.params.id }, (err, clanek) => {
        if (err) {
            return res.render('500');
        }

        if (clanek.tip === 'besedilo') {
            res.render('dobro-je-vedeti/clanek', {
                podstran: clanek,
                sidebar_muce: req.sidebar_muce,
                title: clanek.naslov + ' | Mačja hiša',
                social_description: clanek.vsebina.replace(/<(?:.|\n)*?>/gm, ''),
                social_image: 'http://' + req.headers.host + '/files/page/article_default.png',
            });
        } else if (clanek.tip === 'datoteka') {
            res.redirect('/files/clanki/' + clanek.vsebina);
        } else if (clanek.tip === 'povezava') {
            res.redirect(clanek.vsebina);
        }
    });
});

router.get('/koticek-za-otroke', (req, res) => {
    Podstran.findOne({ naslov: 'Kotiček za otroke' }, (err, podstran) => {
        if (err) {
            return res.render('500');
        }

        Otroci_vsebina.find({}, (err, vsebine) => {
            if (err) {
                return res.render('500');
            }
            res.render('dobro-je-vedeti/koticek-za-otroke', {
                title: 'Kotiček za otroke | Mačja hiša',
                podstran: podstran,
                pobarvanke: vsebine.filter(vsebina => vsebina.kategorija === 'pobarvanka'),
                drugo: vsebine.filter(vsebina => vsebina.kategorija === 'drugo'),
            });
        });
    });
});

router.get('/:podstran', renderGenericPage);

module.exports = router;
