const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');

router.get('/', (req, res) => {
    res.redirect('/pomoc/nacini-pomoci');
});

router.get('/donacije', (req, res) => {
    Podstran.findOne({ naslov: 'Donacije' }, (err, podstran) => {
        if (!podstran) {
            return res.render('404');
        }
        res.render('pomoc/donacije', {
            podstran: podstran,
            nav_kategorije: req.nav_kategorije,
            nav_podstrani: req.nav_podstrani,
            sidebar_muce: req.sidebar_muce,
            title: podstran.naslov + ' | Mačja hiša',
        });
    });
});

router.post('/donacije', (req, res) => {
    Podstran.findOne({ naslov: 'Donacije' }, (err, podstran) => {
        if (!podstran) {
            return res.render('404');
        }
        res.render('pomoc/donacije', {
            podstran: podstran,
            nav_kategorije: req.nav_kategorije,
            nav_podstrani: req.nav_podstrani,
            sidebar_muce: req.sidebar_muce,
            title: podstran.naslov + ' | Mačja hiša',
        });
    });
});

router.get('/zbiramo-za-zavetisce', (req, res) => {
    res.render('pomoc/zbiramo_za_zavetisce');
});

router.get('/:podstran', (req, res) => {
    Podstran.findOne({ url: req.params.podstran }, (err, podstran) => {
        if (!podstran) {
          return res.render('404');
        }
        res.render('pomoc/show', {
            podstran: podstran,
            nav_kategorije: req.nav_kategorije,
            nav_podstrani: req.nav_podstrani,
            sidebar_muce: req.sidebar_muce,
            title: podstran.naslov + ' | Mačja hiša',
        });
    });
});

module.exports = router;
