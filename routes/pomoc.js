const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');
const { renderGenericPage } = require('./util');

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
            sidebar_muce: req.sidebar_muce,
            title: podstran.naslov + ' | Mačja hiša',
        });
    });
});

router.get('/zbiramo-za-zavetisce', (req, res) => {
    res.render('pomoc/zbiramo_za_zavetisce', {
        title: 'Zbiranje sredstev za novo zavetišče | Mačja hiša',
        social_description:
            'Zbiranje sredstev za nakup novega zavetišča v Celju. Skupaj lahko dosežemo vse!',
        hasCustomMetaData: false,
    });
});

router.get('/:podstran', renderGenericPage);

module.exports = router;
