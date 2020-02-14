const Podstran = require('../../models/podstran');

module.exports = {
    renderGenericPage: (req, res) => {
        Podstran.findOne({ url: req.params.podstran }, (err, podstran) => {
            if (err) {
                return res.render('500')
            }
            if (!podstran) {
                return res.render('404');
            }

            res.render('content/generic', {
                podstran: podstran,
                sidebar_muce: req.sidebar_muce,
                title: podstran.naslov + ' | Mačja hiša',
            });
        });
    }
};