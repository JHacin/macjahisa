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
        if (err) return res.render('500');
        Izobrazevalna_vsebina.find({ kategorija: 'zbirka-macje-hise' })
            .sort({ datum: -1 })
            .exec(function(err, vsebine) {
                res.render('dobro-je-vedeti/izobrazevalne-vsebine', {
                    sidebar_muce: req.sidebar_muce,
                    title: 'Zbirka Mačje hiše | Mačja hiša',
                    podstran: podstran,
                    vsebine: vsebine,
                });
            });
    });
});

router.get('/letaki', function(req, res) {
    Podstran.findOne({ naslov: 'Letaki' }, function(err, podstran) {
        if (err) return res.render('500');
        Izobrazevalna_vsebina.find({ kategorija: 'letaki' })
            .sort({ datum: -1 })
            .exec(function(err, vsebine) {
                res.render('dobro-je-vedeti/izobrazevalne-vsebine', {
                    sidebar_muce: req.sidebar_muce,
                    title: 'Letaki | Mačja hiša',
                    podstran: podstran,
                    vsebine: vsebine,
                });
            });
    });
});

router.get('/prispevki-clanki-povezave', function(req, res) {
    Podstran.findOne({ naslov: 'Prispevki, članki, povezave' }, function(err, podstran) {
        if (err) return res.render('500');
        Clanek.find({}, function(err, clanki) {
            if (err) return res.render('500');
            res.render('dobro-je-vedeti/prispevki-clanki-povezave', {
                sidebar_muce: req.sidebar_muce,
                title: 'Prispevki, članki, povezave | Mačja hiša',
                podstran: podstran,
                clanki: clanki,
            });
        });
    });
});

router.get('/prispevki-clanki-povezave/:id', function(req, res) {
    Clanek.findOne({ dbid: req.params.id }, function(err, clanek) {
        if (err) return res.render('500');

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

router.get('/koticek-za-otroke', function(req, res) {
    Podstran.findOne({ naslov: 'Kotiček za otroke' }, function(err, podstran) {
        if (err) return res.render('500');
        Otroci_vsebina.find({}, function(err, vsebine) {
            if (err) return res.render('500');
            res.render('dobro-je-vedeti/koticek-za-otroke', {
                sidebar_muce: req.sidebar_muce,
                title: 'Kotiček za otroke | Mačja hiša',
                podstran: podstran,
                vsebine: vsebine,
            });
        });
    });
});

router.get('/:podstran', renderGenericPage);

module.exports = router;
