const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');
const Muca = require('../models/muca');
const { renderGenericPage } = require('./util');

router.get('/muce', (req, res) => {
    Podstran.findOne({ naslov: 'Muce, ki iščejo dom' }, (err, podstran) => {
        Muca.find()
            .where('status')
            .in([1, 2])
            .sort({ izpostavljena: -1, datum_objave: -1 })
            .exec(function(err, muce) {
                if (err) return res.render('500');
                res.render('posvojitev/seznam_muc', {
                    podstran: podstran,
                    sidebar_muce: req.sidebar_muce,
                    title: 'Muce, ki iščejo dom | Mačja hiša',
                    muce: muce,
                    needsJpList: true,
                });
            });
    });
});

router.get('/muce/:id', (req, res) => {
    Muca.findOne({ dbid: req.params.id }, (err, muca) => {
        if (muca === null) return res.render('404');
        if (err) return res.render('500');
        res.render('posvojitev/individualna_muca', {
            muca: muca,
            sidebar_muce: req.sidebar_muce,
            title: muca.ime + ' | Mačja hiša',
            social_description: muca.opis.replace(/<(?:.|\n)*?>/gm, ''),
            social_image: 'http://' + req.headers.host + '/files/oglasi_muce/' + muca.file_name1,
            needsSlickSlider: true,
        });
    });
});

router.get('/:podstran', renderGenericPage);

module.exports = router;
