const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');
const Muca = require('../models/muca');
const { renderGenericPage } = require('./util');

router.get('/muce', (req, res) => {
    Podstran.findOne({ url: 'muce' }, (err, podstran) => {
        Muca.find()
            .where('status')
            .in([1, 2])
            .sort({ izpostavljena: -1, datum_objave: -1 })
            .exec((err, muce) => {
                if (err) {
                    return res.render('500');
                }
                res.render('posvojitev/seznam_muc', {
                    podstran: podstran,
                    sidebar_muce: req.sidebar_muce,
                    title: 'Iščejo dom | Mačja hiša',
                    muce: muce,
                    needsJpList: true,
                });
            });
    });
});

router.get('/muce/:id', (req, res) => {
    Muca.findOne({ dbid: req.params.id }, (err, muca) => {
        if (err) {
            return res.render('500');
        }
        if (!muca) {
            return res.render('404');
        }

        const slike = [1, 2, 3, 4]
            .filter(i => muca[`file_name${i}`] && muca[`file_name${i}`] !== 'NULL')
            .map(i => muca[`file_name${i}`]);

        const slike_large = [1, 2, 3, 4].map(i =>
            muca[`file_name${i}_large`] && muca[`file_name${i}_large`] !== 'NULL'
                ? muca[`file_name${i}_large`]
                : null
        );

        res.render('posvojitev/individualna_muca', {
            muca: muca,
            slike: slike,
            slike_large: slike_large,
            title: `${muca.ime} | Mačja hiša`,
            social_description: muca.opis.replace(/<(?:.|\n)*?>/gm, ''),
            social_image: `${req.secure ? 'https://' : 'http://'}${
                req.headers.host
            }/files/oglasi_muce/${muca.file_name1}`,
            needsSlickSlider: true,
        });
    });
});

router.get('/:podstran', renderGenericPage);

module.exports = router;
