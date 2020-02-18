const express = require('express');
const router = express.Router({ mergeParams: true });
const Podstran = require('../models/podstran');
const Muca = require('../models/muca');

router.get('/:page', function(req, res, next) {
    const perPage = 20;
    const currentPage = req.params.page || 1;

    Podstran.findOne({ naslov: 'V novem domu' }, (err, podstran) => {
        Muca.find({})
            .where('status')
            .equals(4)
            .sort({ datum_objave: -1 })
            .skip(perPage * currentPage - perPage)
            .limit(perPage)
            .exec((err, muce) => {
                Muca.where('status')
                    .equals(4)
                    .count()
                    .exec((err, count) => {
                        if (err) {
                            return next(err);
                        }

                        res.render('v-novem-domu/index', {
                            podstran: podstran,
                            title: podstran.naslov + ' | Mačja hiša',
                            muce: muce,
                            currentPage: Number(currentPage),
                            totalPages: Math.ceil(count / perPage),
                            steviloVseh: count,
                        });
                    });
            });
    });
});

module.exports = router;
