const express = require('express');
const router = express.Router({ mergeParams: true });
const Muca = require('../models/muca');
const Clanek = require('../models/clanek');
const Podstran = require('../models/podstran');
const Naslovnica = require('../models/naslovnica');
const Kategorija = require('../models/kategorija');
const Kontakt = require('../models/kontakt');
const Oskrbnica = require('../models/oskrbnica');
const Izobrazevalna_vsebina = require('../models/izobrazevalna_vsebina');
const Otroci_vsebina = require('../models/otroci_vsebina');
const User = require('../models/user');
const moment = require('moment');
const passport = require('passport');
const middleware = require('../middleware');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const async = require('async');
const fs = require('fs');

// MULTER
const multer = require('multer');
const storage_muce = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/oglasi_muce');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname.replace(/[ )(]/g, ''));
    },
});

const storage_clanki = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/clanki');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/[ )(]/g, ''));
    },
});

const storage_izobrazevanje = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/izobrazevanje');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/[ )(]/g, ''));
    },
});

const storage_otroci = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/otroski-koticek');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/[ )(]/g, ''));
    },
});

const storage_naslovnice = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files/naslovnice');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname.replace(/[ )(]/g, ''));
    },
});

const upload_muce = multer({ storage: storage_muce, limits: { fieldSize: 25 * 1024 * 10240 } });
const upload_clanki = multer({ storage: storage_clanki, limits: { fieldSize: 25 * 1024 * 10240 } });
const upload_izobrazevanje = multer({
    storage: storage_izobrazevanje,
    limits: { fieldSize: 25 * 1024 * 10240 },
});
const upload_otroci = multer({ storage: storage_otroci, limits: { fieldSize: 25 * 1024 * 10240 } });
const upload_naslovnice = multer({
    storage: storage_naslovnice,
    limits: { fieldSize: 25 * 1024 * 10240 },
});
// END MULTER

// INDEX ADMIN
router.get('/', (req, res) => {
    if (req.user) {
        return res.redirect('/admin/muce/iscejo');
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.get('/register', (req, res) => {
    res.render('admin/register');
});

// LOGIN LOGIC
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/admin/muce/iscejo',
        failureRedirect: '/admin/login',
    }),
    (req, res) => {}
);

// LOGOUT LOGIC
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Odjava uspešna.');
    res.redirect('/admin/login');
});

// MUCE
router.get('/muce/iscejo', middleware.isLoggedIn, (req, res) => {
    Muca.find()
        .where('status')
        .in([1, 2])
        .sort({ datum_objave: -1 })
        .exec((err, muce) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/muce/index', { muce: muce, title: 'Muce za posvojitev' });
        });
});

// MUCE KI IŠČEJO BOTRA
router.get('/muce/iscejo_botra', middleware.isLoggedIn, (req, res) => {
    Muca.find()
        .where('posvojitev_na_daljavo')
        .equals(1)
        .where('status')
        .in([1, 2, 3])
        .sort({ datum_objave: -1 })
        .exec((err, muce) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/muce/index_boter', { muce: muce, title: 'Iščejo botra' });
        });
});

router.get('/muce/v-novem-domu', middleware.isLoggedIn, (req, res) => {
    Muca.find()
        .where('status')
        .equals(4)
        .sort({ datum_objave: -1 })
        .exec((err, muce) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/muce/index', { muce: muce, title: 'V novem domu' });
        });
});

router.get('/muce/arhiv', middleware.isLoggedIn, (req, res) => {
    Muca.find({})
        .sort({ datum_objave: -1 })
        .exec((err, muce) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/muce/index', { muce: muce, title: 'Seznam vseh muc' });
        });
});

router.get('/muce/:id/edit/', middleware.isLoggedIn, (req, res) => {
    Muca.findOne({ dbid: req.params.id }, (err, muca) => {
        Kontakt.find({}, (err, kontakti) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/muce/iscejo');
            }
            res.render('admin/muce/edit', { muca: muca, kontakti: kontakti });
        });
    });
});

router.get('/muce/add', middleware.isLoggedIn, (req, res) => {
    Kontakt.find({}, (err, kontakti) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/muce/iscejo');
        }
        res.render('admin/muce/add', { kontakti: kontakti });
    });
});

router.post('/muce', middleware.isLoggedIn, (req, res) => {
    Muca.count({}, (err, count) => {
        // dodaj novo muco
        Muca.create(req.body, (err, novaMuca) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake.');
                return res.redirect('/admin/login');
            }

            novaMuca.dbid = count + 1;
            novaMuca.izpostavljena = req.body.izpostavljena;

            // VET STATUS
            for (let key in req.body.vet) {
                novaMuca.vet[key] = req.body.vet[key];
            }

            // slike
            if (req.body.slika1_crop) {
                var base64_string = req.body.slika1_crop.replace(/^data:image\/\w+;base64,/, '');

                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_1' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name1 = imageName;
            }

            if (req.body.slika1_large_crop) {
                var base64_string = req.body.slika1_large_crop.replace(
                    /^data:image\/\w+;base64,/,
                    ''
                );

                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_1_large' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name1_large = imageName;
            }

            if (req.body.slika2_crop) {
                var base64_string = req.body.slika2_crop.replace(/^data:image\/\w+;base64,/, '');
                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_2' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name2 = imageName;
            }

            if (req.body.slika2_large_crop) {
                var base64_string = req.body.slika2_large_crop.replace(
                    /^data:image\/\w+;base64,/,
                    ''
                );

                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_2_large' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name2_large = imageName;
            }

            if (req.body.slika3_crop) {
                var base64_string = req.body.slika3_crop.replace(/^data:image\/\w+;base64,/, '');
                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_3' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name3 = imageName;
            }

            if (req.body.slika3_large_crop) {
                var base64_string = req.body.slika3_large_crop.replace(
                    /^data:image\/\w+;base64,/,
                    ''
                );

                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_3_large' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name3_large = imageName;
            }

            if (req.body.slika4_crop) {
                var base64_string = req.body.slika4_crop.replace(/^data:image\/\w+;base64,/, '');
                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_4' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name4 = imageName;
            }

            if (req.body.slika4_large_crop) {
                var base64_string = req.body.slika4_large_crop.replace(
                    /^data:image\/\w+;base64,/,
                    ''
                );

                var imageBuffer = Buffer.from(base64_string, 'base64');
                var imageName = novaMuca.dbid + '_' + '_4_large' + '.jpeg';
                var fileLocation = 'public/files/oglasi_muce/' + imageName;
                try {
                    fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                } catch (e) {
                    console.error(e);
                }
                novaMuca.file_name4_large = imageName;
            }

            novaMuca.ime = req.body.ime;
            novaMuca.status = Number(req.body.status);
            novaMuca.mesec_rojstva = moment(req.body.mesec_rojstva).toISOString();
            novaMuca.boter_povezava = req.body.boter_povezava;
            novaMuca.SEOmetaTitle = req.body.SEOmetaTitle;
            novaMuca.SEOmetaDescription = req.body.SEOmetaDescription;
            novaMuca.SEOfbTitle = req.body.SEOfbTitle;
            novaMuca.SEOfbDescription = req.body.SEOfbDescription;
            novaMuca.SEOtwitterTitle = req.body.SEOtwitterTitle;
            novaMuca.SEOtwitterDescription = req.body.SEOtwitterDescription;

            if (
                req.body.SEOmetaTitle === '' ||
                req.body.SEOmetaTitle === null ||
                req.body.SEOmetaTitle === undefined ||
                req.body.SEOmetaTitle === 'undefined'
            ) {
                novaMuca.SEOmetaTitle = req.body.ime + ' | Mačja hiša';
                novaMuca.SEOfbTitle = req.body.ime + ' | Mačja hiša';
                novaMuca.SEOtwitterTitle = req.body.ime + ' | Mačja hiša';
                novaMuca.SEOmetaDescription = req.body.opis
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
                novaMuca.SEOfbDescription = req.body.opis
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
                novaMuca.SEOtwitterDescription = req.body.opis
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
            }

            novaMuca.save(err => {
                if (err) {
                    console.error(err);
                }
            });

            req.flash('success', 'Nova muca dodana.');
            res.send({ redirect: '/admin/muce/iscejo' });
        });
    });
});

const sendNotificationMail = (muca, oskrbnice) => {
    let transporter = nodemailer.createTransport({
        host: 'mail.macjahisa.si',
        port: 26,
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.NOTIF_MAIL,
            pass: process.env.NOTIF_MAIL_PW,
        },
    });

    let mailOptions = {
        from: process.env.NOTIF_MAIL, // sender address
        to: oskrbnice, // list of receivers
        subject: `${muca.ime} gre v nov dom`, // Subject line
        text: 'To je samodejno generirano sporočilo.', // plain text body
        html: '<p><strong>Datum odhoda: </strong>' + moment().format('D[.]M[.]YYYY') + '</p>', // html body
    };

    transporter
        .sendMail(mailOptions)
        .then(info => {
            console.log(info);
            return true;
        })
        .catch(err => {
            console.error(err);
        });
};

router.put('/muce/:id', middleware.isLoggedIn, (req, res) => {
    Muca.findById(req.params.id, (err, muca) => {
        if (err) {
            req.flash('error', 'Muce ne najdem v bazi podatkov.');
            return res.redirect('/admin/login');
        }

        const newStatus = Number(req.body.status);
        const greVNovDom = newStatus === 4 && muca.status !== 4;
        const jePrislaNazaj = newStatus !== 4 && muca.status === 4;

        muca.ime = req.body.ime;
        muca.boter_povezava = req.body.boter_povezava;
        muca.SEOmetaTitle = req.body.SEOmetaTitle;
        muca.SEOmetaDescription = req.body.SEOmetaDescription;
        muca.SEOfbTitle = req.body.SEOfbTitle;
        muca.SEOfbDescription = req.body.SEOfbDescription;
        muca.SEOtwitterTitle = req.body.SEOtwitterTitle;
        muca.SEOtwitterDescription = req.body.SEOtwitterDescription;

        if (
            req.body.SEOmetaTitle === '' ||
            req.body.SEOmetaTitle === null ||
            req.body.SEOmetaTitle === undefined ||
            req.body.SEOmetaTitle === 'undefined'
        ) {
            muca.SEOmetaTitle = req.body.ime + ' | Mačja hiša';
            muca.SEOfbTitle = req.body.ime + ' | Mačja hiša';
            muca.SEOtwitterTitle = req.body.ime + ' | Mačja hiša';
            muca.SEOmetaDescription = req.body.opis
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
            muca.SEOfbDescription = req.body.opis.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 300);
            muca.SEOtwitterDescription = req.body.opis
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
        }

        muca.datum = req.body.datum;
        muca.datum_objave = req.body.datum_objave;
        muca.izpostavljena = req.body.izpostavljena;
        muca.status = newStatus;
        muca.mesec_rojstva = moment(req.body.mesec_rojstva).toISOString();
        muca.spol = req.body.spol;
        muca.opis = req.body.opis;
        muca.kontakt = req.body.kontakt;
        muca.posvojitev_na_daljavo = req.body.posvojitev_na_daljavo;

        muca.vet = {
            s_k: false,
            cipiranje: false,
            cepljenje: false,
            razparazit: false,
            felv: false,
            fiv: false,
        };
        for (let key in req.body.vet) {
            muca.vet[key] = req.body.vet[key];
        }

        if (greVNovDom || jePrislaNazaj) {
            muca.datum = moment();
            muca.datum_objave = moment();
        }

        [1, 2, 3, 4].forEach(imageIndex => {
            const needsToBeDeleted = req.body[`slika${imageIndex}_delete`];
            if (needsToBeDeleted) {
                muca[`file_name${imageIndex}`] = undefined;
                muca[`file_name${imageIndex}_large`] = undefined;
            } else {
                const imageField = req.body[`slika${imageIndex}_crop`];
                if (imageField) {
                    const base64_string = imageField.replace(/^data:image\/\w+;base64,/, '');
                    const imageBuffer = Buffer.from(base64_string, 'base64');
                    const imageName = `${muca.dbid}__${imageIndex}.jpeg`;
                    const fileLocation = `public/files/oglasi_muce/${imageName}`;
                    try {
                        fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                    } catch (err) {
                        console.error(err);
                    }
                    muca[`file_name${imageIndex}`] = imageName;
                }

                const largeImageField = req.body[`slika${imageIndex}_large_crop`];
                if (largeImageField) {
                    const base64_string = largeImageField.replace(/^data:image\/\w+;base64,/, '');
                    const imageBuffer = Buffer.from(base64_string, 'base64');
                    const imageName = `${muca.dbid}__${imageIndex}_large.jpeg`;
                    const fileLocation = `public/files/oglasi_muce/${imageName}`;
                    try {
                        fs.writeFileSync(fileLocation, imageBuffer, { encoding: 'base64' });
                    } catch (err) {
                        console.error(err);
                    }
                    muca[`file_name${imageIndex}_large`] = imageName;
                }
            }
        });

        if (greVNovDom) {
            Oskrbnica.find({ aktivna: 'Da' }, async (err, oskrbnice) => {
                if (err) {
                    req.flash('error', 'Prišlo je do napake pri pošiljanju e-mail obvestila.');
                    return res.redirect('/admin/muce/iscejo');
                }
                const list = oskrbnice.map(o => o.email);
                sendNotificationMail(muca, list);
            });
        }

        muca.save(err => {
            if (err) {
                return console.log(err);
            }
        });

        req.flash(
            'success',
            'Podatki muce posodobljeni. Če na spletni strani ne vidiš spremembe, moraš v brskalniku izbrisati predpomnilnik.'
        );
        res.send({ redirect: '/admin/muce/iscejo' });
    });
});
// END MUCE

// ČLANKI
router.get('/clanki', middleware.isPageEditor, (req, res) => {
    // prikaži vse članke po vrsti od nazadnje objavljenega
    Clanek.find({})
        .sort({ datum: -1 })
        .exec((err, clanki) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/clanki/index', { clanki: clanki });
        });
});

router.get('/clanki/add_text', middleware.isPageEditor, (req, res) => {
    res.render('admin/clanki/add_text');
});

router.get('/clanki/add_file', middleware.isPageEditor, (req, res) => {
    res.render('admin/clanki/add_file');
});

router.get('/clanki/add_link', middleware.isPageEditor, (req, res) => {
    res.render('admin/clanki/add_link');
});

router.get('/clanki/:id/edit', middleware.isPageEditor, (req, res) => {
    Clanek.findOne({ dbid: req.params.id }, (err, clanek) => {
        if (err) {
            req.flash('error', 'Članka ne najdem v bazi podatkov.');
            return res.redirect('/admin/clanki');
        }
        const tip = clanek.tip;
        if (tip == 'datoteka') {
            res.render('admin/clanki/edit_file', { clanek: clanek });
        } else if (tip == 'povezava') {
            res.render('admin/clanki/edit_link', { clanek: clanek });
        } else {
            res.render('admin/clanki/edit_text', { clanek: clanek });
        }
    });
});

router.post(
    '/clanki_upload',
    middleware.isPageEditor,
    upload_clanki.single('clanek[vsebina]'),
    (req, res, next) => {
        Clanek.count({}, (err, count) => {
            Clanek.create(req.body.clanek, (err, clanek) => {
                if (err) {
                    req.flash('error', 'Prišlo je do napake pri dodajanju prispevka.');
                    return res.redirect('/admin/clanki');
                }
                if (req.file) {
                    clanek.vsebina = req.file.originalname.replace(/[ )(]/g, '');
                    clanek.dbid = count + 1;
                    clanek.save();
                }

                req.flash('success', 'Prispevek dodan.');
                res.redirect('/admin/clanki');
            });
        });
    }
);

router.post('/clanki', middleware.isPageEditor, (req, res) => {
    Clanek.count({}, (err, count) => {
        Clanek.create(req.body.clanek, (err, clanek) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri dodajanju prispevka.');
                return res.redirect('/admin/clanki');
            }
            clanek.dbid = count + 1;
            clanek.save();

            if (req.body.clanek.SEOmetaTitle === '') {
                clanek.SEOmetaTitle = req.body.clanek.naslov + ' | Mačja hiša';
                clanek.SEOfbTitle = req.body.clanek.naslov + ' | Mačja hiša';
                clanek.SEOtwitterTitle = req.body.clanek.naslov + ' | Mačja hiša';
                clanek.SEOmetaDescription = req.body.clanek.vsebina
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
                clanek.SEOfbDescription = req.body.clanek.vsebina
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
                clanek.SEOtwitterDescription = req.body.clanek.vsebina
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .substring(0, 300);
            }

            clanek.save();

            req.flash('success', 'Prispevek dodan.');
            res.redirect('/admin/clanki');
        });
    });
});

router.get('/clanki/:id', middleware.isPageEditor, (req, res) => {
    Clanek.findOne({ dbid: req.params.id }, (err, clanek) => {
        if (err) {
            req.flash('error', 'Članka ne najdem v bazi podatkov.');
            return res.redirect('/admin/clanki');
        }
        if (clanek.tip == 'povezava') {
            res.redirect(clanek.vsebina);
        } else if (clanek.tip == 'datoteka') {
            res.redirect('/files/clanki/' + clanek.vsebina);
        } else {
            res.redirect('/dobro-je-vedeti/prispevki-clanki-povezave/' + clanek.dbid);
        }
    });
});

router.put('/clanki/:id', middleware.isPageEditor, (req, res) => {
    Clanek.findOneAndUpdate({ dbid: req.params.id }, req.body.clanek, (err, clanek) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri posodabljanju prispevka.');
            return res.redirect('/admin/clanki');
        }

        if (req.body.clanek.nova_vsebina != undefined && req.body.clanek.nova_vsebina != '') {
            clanek.vsebina = req.body.clanek.nova_vsebina;
            clanek.save();
        }
        // posodobi kategorijo
        if (!clanek.kategorija || clanek.kategorija !== req.body.clanek.kategorija) {
            clanek.kategorija = req.body.clanek.kategorija;
            clanek.save();
        }

        if (req.body.clanek.SEOmetaTitle === '') {
            clanek.SEOmetaTitle = req.body.clanek.naslov + ' | Mačja hiša';
            clanek.SEOfbTitle = req.body.clanek.naslov + ' | Mačja hiša';
            clanek.SEOtwitterTitle = req.body.clanek.naslov + ' | Mačja hiša';
            clanek.SEOmetaDescription = req.body.clanek.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
            clanek.SEOfbDescription = req.body.clanek.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
            clanek.SEOtwitterDescription = req.body.clanek.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
        }

        req.flash('success', 'Prispevek posodobljen.');
        res.redirect('/admin/clanki');
    });
});

router.put(
    '/clanki_upload/:id',
    middleware.isPageEditor,
    upload_clanki.single('clanek[nova_vsebina]'),
    (req, res, next) => {
        Clanek.findByIdAndUpdate(req.params.id, req.body.clanek, (err, clanek) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri posodabljanju prispevka.');
                return res.redirect('/admin/clanki');
            }
            if (req.file) {
                clanek.vsebina = req.file.originalname.replace(/[ )(]/g, '');
                clanek.save();
            }
            req.flash('success', 'Prispevek posodobljen.');
            res.redirect('/admin/clanki');
        });
    }
);
// END ČLANKI

// BEGIN IZOBRAŽEVANJE
router.get('/izobrazevalne-vsebine', middleware.isPageEditor, (req, res) => {
    // prikaži vse vsebine po vrsti od nazadnje spremenjene
    Izobrazevalna_vsebina.find({})
        .sort({ datum: -1 })
        .exec((err, vsebine) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/izobrazevalne-vsebine/index', { vsebine: vsebine });
        });
});

router.get('/izobrazevalne-vsebine/add', middleware.isPageEditor, (req, res) => {
    res.render('admin/izobrazevalne-vsebine/add');
});

router.get('/izobrazevalne-vsebine/:id/edit', middleware.isPageEditor, (req, res) => {
    Izobrazevalna_vsebina.findById(req.params.id, (err, vsebina) => {
        if (err) {
            req.flash('error', 'Vsebine ne najdem v bazi podatkov.');
            return res.redirect('/admin/izobrazevalne-vsebine');
        }
        res.render('admin/izobrazevalne-vsebine/edit', { vsebina: vsebina });
    });
});

router.post(
    '/izobrazevalne-vsebine',
    middleware.isPageEditor,
    upload_izobrazevanje.fields([
        { name: 'vsebina[datoteka]' },
        { name: 'vsebina[naslovna_slika]' },
    ]),
    (req, res, next) => {
        Izobrazevalna_vsebina.create(req.body.vsebina, (err, vsebina) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri vnosu vsebine.');
                return res.redirect('/admin/izobrazevalne-vsebine');
            }
            if (req.files['vsebina[datoteka]']) {
                vsebina.datoteka = req.files['vsebina[datoteka]'][0].originalname.replace(
                    /[ )(]/g,
                    ''
                );
                vsebina.save();
            }

            if (req.files['vsebina[naslovna_slika]']) {
                vsebina.naslovna_slika = req.files[
                    'vsebina[naslovna_slika]'
                ][0].originalname.replace(/[ )(]/g, '');
                vsebina.save();
            }
            req.flash('success', 'Vsebina dodana.');
            res.redirect('/admin/izobrazevalne-vsebine');
        });
    }
);

router.put(
    '/izobrazevalne-vsebine/:id',
    middleware.isPageEditor,
    upload_izobrazevanje.fields([
        { name: 'vsebina[nova_datoteka]' },
        { name: 'vsebina[nova_naslovna_slika]' },
    ]),
    (req, res, next) => {
        Izobrazevalna_vsebina.findByIdAndUpdate(req.params.id, req.body.vsebina, (err, vsebina) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri posodabljanju vsebine.');
                return res.redirect('/admin/izobrazevalne-vsebine');
            }
            if (req.files['vsebina[nova_datoteka]']) {
                vsebina.datoteka = req.files['vsebina[nova_datoteka]'][0].originalname.replace(
                    /[ )(]/g,
                    ''
                );
                vsebina.save();
            }
            if (req.files['vsebina[nova_naslovna_slika]']) {
                vsebina.naslovna_slika = req.files[
                    'vsebina[nova_naslovna_slika]'
                ][0].originalname.replace(/[ )(]/g, '');
                vsebina.save();
            }
            req.flash('success', 'Vsebina posodobljena.');
            res.redirect('/admin/izobrazevalne-vsebine');
        });
    }
);
// END IZOBRAŽEVANJE

// BEGIN OTROŠKI KOTIČEK
router.get('/koticek-za-otroke', middleware.isPageEditor, (req, res) => {
    Otroci_vsebina.find({})
        .sort({ datum: -1 })
        .exec((err, vsebine) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/koticek-za-otroke/index', { vsebine: vsebine });
        });
});

router.get('/koticek-za-otroke/add', middleware.isPageEditor, (req, res) => {
    res.render('admin/koticek-za-otroke/add');
});

router.get('/koticek-za-otroke/:id/edit', middleware.isPageEditor, (req, res) => {
    Otroci_vsebina.findById(req.params.id, (err, vsebina) => {
        if (err) {
            req.flash('error', 'Vsebine ne najdem v bazi podatkov.');
            return res.redirect('/admin/koticek-za-otroke');
        }
        res.render('admin/koticek-za-otroke/edit', { vsebina: vsebina });
    });
});

router.post(
    '/koticek-za-otroke',
    middleware.isPageEditor,
    upload_otroci.fields([{ name: 'vsebina[datoteka]' }, { name: 'vsebina[naslovna_slika]' }]),
    (req, res, next) => {
        Otroci_vsebina.create(req.body.vsebina, (err, vsebina) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri vnosu vsebine.');
                return res.redirect('/admin/koticek-za-otroke');
            }
            if (req.files['vsebina[datoteka]']) {
                vsebina.datoteka = req.files['vsebina[datoteka]'][0].originalname.replace(
                    /[ )(]/g,
                    ''
                );
                vsebina.save();
            }

            if (req.files['vsebina[naslovna_slika]']) {
                vsebina.naslovna_slika = req.files[
                    'vsebina[naslovna_slika]'
                ][0].originalname.replace(/[ )(]/g, '');
                vsebina.save();
            }
            req.flash('success', 'Vsebina dodana.');
            res.redirect('/admin/koticek-za-otroke');
        });
    }
);

router.put(
    '/koticek-za-otroke/:id',
    middleware.isPageEditor,
    upload_otroci.fields([
        { name: 'vsebina[nova_datoteka]' },
        { name: 'vsebina[nova_naslovna_slika]' },
    ]),
    (req, res, next) => {
        Otroci_vsebina.findByIdAndUpdate(req.params.id, req.body.vsebina, (err, vsebina) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri posodabljanju vsebine.');
                return res.redirect('/admin/koticek-za-otroke');
            }
            if (req.files['vsebina[nova_datoteka]']) {
                vsebina.datoteka = req.files['vsebina[nova_datoteka]'][0].originalname.replace(
                    /[ )(]/g,
                    ''
                );
                vsebina.save();
            }
            if (req.files['vsebina[nova_naslovna_slika]']) {
                vsebina.naslovna_slika = req.files[
                    'vsebina[nova_naslovna_slika]'
                ][0].originalname.replace(/[ )(]/g, '');
                vsebina.save();
            }
            req.flash('success', 'Vsebina posodobljena.');
            res.redirect('/admin/koticek-za-otroke');
        });
    }
);
// END OTROŠKI KOTIČEK

// PODSTRANI
router.get('/podstrani', middleware.isPageEditor, (req, res) => {
    // prikaži vse podstrani po vrsti od nazadnje spremenjene
    Podstran.find({})
        .sort({ datum: -1 })
        .populate('kategorija')
        .exec((err, podstrani) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/podstrani/index', { podstrani: podstrani });
        });
});

router.post('/podstrani', middleware.isPageEditor, (req, res) => {
    Kategorija.findById(req.body.podstran.kategorija, (err, kategorija) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri kreiranju podstrani.');
            return res.redirect('/admin/podstrani');
        }
        Podstran.create(req.body.podstran, (err, podstran) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri kreiranju podstrani.');
                return res.redirect('/admin/podstrani');
            } else {
                podstran.dbid = kategorija.podstrani_length + 1;
                podstran.naslov_en = '';
                podstran.vsebina_en = '';
                podstran.vrstni_red = kategorija.podstrani_length + 1;
                podstran.include_after = '';
                podstran.include_before = '';
                podstran.zadnja_sprememba = moment();
                podstran.save();
                kategorija.podstrani_length += 1;
                kategorija.save();

                if (req.body.podstran.SEOmetaTitle === '') {
                    podstran.SEOmetaTitle = req.body.podstran.naslov + ' | Mačja hiša';
                    podstran.SEOfbTitle = req.body.podstran.naslov + ' | Mačja hiša';
                    podstran.SEOtwitterTitle = req.body.podstran.naslov + ' | Mačja hiša';
                    podstran.SEOmetaDescription = req.body.podstran.vsebina
                        .replace(/<\/?[^>]+(>|$)/g, '')
                        .substring(0, 300);
                    podstran.SEOfbDescription = req.body.podstran.vsebina
                        .replace(/<\/?[^>]+(>|$)/g, '')
                        .substring(0, 300);
                    podstran.SEOtwitterDescription = req.body.podstran.vsebina
                        .replace(/<\/?[^>]+(>|$)/g, '')
                        .substring(0, 300);
                }
                podstran.save();

                req.flash('success', 'Podstran dodana.');
                res.redirect('/admin/podstrani');
            }
        });
    });
});

router.get('/podstrani/add', middleware.isPageEditor, (req, res) => {
    Kategorija.find({}, (err, kategorije) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/podstrani');
        }
        res.render('admin/podstrani/add', { kategorije: kategorije });
    });
});

router.put('/podstrani/:id', middleware.isPageEditor, (req, res) => {
    Podstran.findByIdAndUpdate(req.params.id, req.body.podstran, (err, podstran) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri posodabljanju podstrani.');
            return res.redirect('/admin/login');
        }

        if (req.body.podstran.SEOmetaTitle === '') {
            podstran.SEOmetaTitle = req.body.podstran.naslov + ' | Mačja hiša';
            podstran.SEOfbTitle = req.body.podstran.naslov + ' | Mačja hiša';
            podstran.SEOtwitterTitle = req.body.podstran.naslov + ' | Mačja hiša';
            podstran.SEOmetaDescription = req.body.podstran.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
            podstran.SEOfbDescription = req.body.podstran.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
            podstran.SEOtwitterDescription = req.body.podstran.vsebina
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, 300);
        }
        podstran.save();

        Kategorija.findById(req.body.podstran.kategorija, (err, kategorija) => {
            if (err) return res.render('500');
            kategorija.save();
            req.flash('success', 'Podstran posodobljena.');
            res.redirect('/admin/podstrani/');
        });
    });
});

router.get('/podstrani/:id/edit', middleware.isPageEditor, (req, res) => {
    Podstran.findById(req.params.id, (err, podstran) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        Kategorija.find({}, (err, kategorije) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/podstrani/edit', { podstran: podstran, kategorije: kategorije });
        });
    });
});

// END PODSTRANI

// MENU
router.get('/menu', middleware.isOwner, (req, res) => {
    // prikaži vse podstrani po vrsti od nazadnje spremenjene
    Kategorija.find({}, (err, kategorije) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        Podstran.find({}, (err, podstrani) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake v bazi podatkov.');
                return res.redirect('/admin/login');
            }
            res.render('admin/menu/index', { kategorije: kategorije, podstrani: podstrani });
        });
    });
});

router.get('/menu/add', middleware.isOwner, (req, res) => {
    res.render('admin/menu/add');
});

router.post('/menu', middleware.isOwner, (req, res) => {
    Kategorija.create({ naslov: req.body.naslov, url: req.body.url }, (err, kategorija) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri dodajanju kategorije.');
            return res.redirect('/admin/menu');
        }
        req.flash('success', 'Kategorija dodana.');
        res.redirect('/admin/menu/');
    });
});

router.get('/menu/:id/edit', middleware.isOwner, (req, res) => {
    Kategorija.findById(req.params.id, (err, kategorija) => {
        if (err) {
            req.flash('error', 'Kategorije ne najdem v bazi podatkov.');
            return res.redirect('/admin/menu');
        }
        res.render('admin/menu/edit', { kategorija: kategorija });
    });
});

router.put('/menu/:id', middleware.isOwner, (req, res) => {
    Kategorija.findByIdAndUpdate(
        req.params.id,
        { naslov: req.body.naslov, url: req.body.url },
        (err, kategorija) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri posodabljanju kategorije.');
                return res.redirect('/admin/menu');
            }
            req.flash('success', 'Kategorija posodobljena.');
            res.redirect('/admin/menu/');
        }
    );
});
// END MENU

// BEGIN CONTACTS
router.get('/kontakti', middleware.isAdmin, (req, res) => {
    Kontakt.find({}, (err, kontakti) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        res.render('admin/kontakti/index', { kontakti: kontakti });
    });
});

router.get('/kontakti/add', middleware.isAdmin, (req, res) => {
    res.render('admin/kontakti/add');
});

router.post('/kontakti', middleware.isAdmin, (req, res) => {
    Kontakt.create(req.body.kontakt, (err, kontakt) => {
        if (err) {
            return console.log(err);
            req.flash('error', 'Prišlo je do napake pri dodajanju kontakta.');
            return res.redirect('/admin/kontakti');
        }
        req.flash('success', 'Kontaktna oseba dodana.');
        res.redirect('/admin/kontakti');
    });
});

router.get('/kontakti/:id/edit', middleware.isAdmin, (req, res) => {
    Kontakt.findById(req.params.id, (err, kontakt) => {
        if (err) {
            req.flash('error', 'Kontakta ne najdem v bazi podatkov.');
            return res.redirect('/admin/kontakti');
        }
        res.render('admin/kontakti/edit', { kontakt: kontakt });
    });
});

router.put('/kontakti/:id', middleware.isAdmin, (req, res) => {
    Kontakt.findByIdAndUpdate(req.params.id, req.body.kontakt, (err, kontakt) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri posodabljanju kontakta.');
            return res.redirect('/admin/kontakti');
        }
        req.flash('success', 'Kontaktna oseba posodobljena.');
        res.redirect('/admin/kontakti');
    });
});
// END CONTACTS

// OSKRBNICE
router.get('/oskrbnice', middleware.isAdmin, (req, res) => {
    Oskrbnica.find({}, (err, oskrbnice) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        res.render('admin/oskrbnice/index', { oskrbnice: oskrbnice });
    });
});

router.get('/oskrbnice/add', middleware.isAdmin, (req, res) => {
    res.render('admin/oskrbnice/add');
});

router.post('/oskrbnice', middleware.isAdmin, (req, res) => {
    Oskrbnica.create(req.body.oskrbnica, (err, oskrbnica) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri dodajanju.');
            return res.redirect('/admin/oskrbnice');
        }
        req.flash('success', 'Oskrbnica dodana.');
        res.redirect('/admin/oskrbnice/');
    });
});

router.get('/oskrbnice/:id/edit', middleware.isAdmin, (req, res) => {
    Oskrbnica.findById(req.params.id, (err, oskrbnica) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/oskrbnice');
        }
        res.render('admin/oskrbnice/edit', { oskrbnica: oskrbnica });
    });
});

router.put('/oskrbnice/:id', middleware.isAdmin, (req, res) => {
    Oskrbnica.findByIdAndUpdate(req.params.id, req.body.oskrbnica, (err, oskrbnica) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake pri posodabljanju podatkov.');
            return res.redirect('/admin/oskrbnice');
        }
        req.flash('success', 'Oskrbnica posodobljena.');
        res.redirect('/admin/oskrbnice');
    });
});
// END OSKRBNICE

// BEGIN USERS
router.get('/users', middleware.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        res.render('admin/users/index', { users: users });
    });
});

router.get('/users/add', middleware.isAdmin, (req, res) => {
    res.render('admin/users/add');
});

router.post('/users', middleware.isAdmin, (req, res) => {
    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        adminLevel: req.body.adminLevel,
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/admin/users/add');
        }
        req.flash('success', 'Nov ' + user.adminLevel + ' dodan.');
        res.redirect('/admin/users/');
    });
});

router.get('/users/:id/edit', middleware.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/users');
        }
        res.render('admin/users/edit', { user: user });
    });
});

router.put('/users/:id', middleware.isAdmin, (req, res) => {
    const userData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        adminLevel: req.body.adminLevel,
    };
    User.findByIdAndUpdate(req.params.id, userData, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/users');
        }
        req.flash('success', 'Uporabnik posodobljen.');
        res.redirect('/admin/users');
    });
});
// END USERS

// BEGIN PROFIL UPORABNIKA
router.get('/profil', middleware.isLoggedIn, (req, res) => {
    res.render('admin/profil', { user: req.user });
});

router.get('/profil/geslo', middleware.isLoggedIn, (req, res) => {
    res.render('admin/profil/geslo', { user: req.user });
});

router.put('/profil/:id', middleware.isLoggedIn, (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };
    User.findByIdAndUpdate(req.params.id, userData, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/admin/users');
        }
        req.flash('success', 'Uporabnik posodobljen.');
        res.redirect('/admin/users');
    });
});

// sprememba gesla
router.put('/profil/geslo/:id', middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi.');
            return res.redirect('/admin/profil');
        }

        if (req.body.newPassword === req.body.confirm) {
            user.changePassword(req.body.oldPassword, req.body.newPassword, err => {
                if (err) {
                    req.flash('error', 'Staro geslo ni pravilno.');
                    return res.redirect('/admin/profil/geslo');
                }
                req.flash('success', 'Geslo spremenjeno.');
                res.redirect('/admin/muce/iscejo');
            });
        } else {
            req.flash('error', 'Novi gesli se ne ujemata.');
            return res.redirect('/admin/profil/geslo');
        }
    });
});
// END PROFIL UPORABNIKA

// BEGIN SPREMEMBA POZABLJENEGA GESLA
router.get('/forgot', (req, res) => {
    res.render('admin/forgot');
});

router.post('/forgot', (req, res, next) => {
    async.waterfall(
        [
            done => {
                crypto.randomBytes(20, (err, buf) => {
                    const token = buf.toString('hex');
                    done(err, token);
                });
            },
            (token, done) => {
                User.findOne({ email: req.body.email }, (err, user) => {
                    if (err) {
                        req.flash('error', 'Nekaj je šlo narobe.');
                        return res.redirect('back');
                    }
                    if (!user) {
                        req.flash('error', 'Uporabnik s tem e-mail naslovom ne obstaja.');
                        return res.redirect('/admin/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(err => {
                        done(err, token, user);
                    });
                });
            },
            (token, user, done) => {
                const smtpTransport = nodemailer.createTransport({
                    host: 'mail.macjahisa.si',
                    port: 26,
                    secure: false,
                    tls: {
                        rejectUnauthorized: false,
                    },
                    auth: {
                        user: process.env.NOTIF_MAIL,
                        pass: process.env.NOTIF_MAIL_PW,
                    },
                });

                const link = 'http://www.macjahisa.si/admin/reset/' + token;

                const mailOptions = {
                    to: user.email,
                    from: process.env.NOTIF_MAIL,
                    subject: 'Mačja hiša CMS - Sprememba gesla',
                    text:
                        'Vi (ali nekdo drug) je zahteval ponastavitev vašega gesla za administrativno (CMS) stran Mačje hiše.\n\n' +
                        'Postopek lahko zaključite z uporabo spodnje povezave:\n\n' +
                        'http://www.macjahisa.si/admin/reset/' +
                        token +
                        '\n\n' +
                        'Če ponastavitve gesla niste zahtevali, lahko to sporočilo ignorirate.\n',
                    html:
                        "<p>Vi (ali nekdo drug) je zahteval ponastavitev vašega gesla za administrativno (CMS) stran Mačje hiše.</p><p>Postopek lahko zaključite z uporabo spodnje povezave:</p><p><a href='" +
                        link +
                        "' target='_blank'>" +
                        link +
                        '</a></p><p>Če ponastavitve gesla niste zahtevali, lahko to sporočilo ignorirate.</p>',
                };
                smtpTransport.sendMail(mailOptions, err => {
                    req.flash(
                        'success',
                        'Navodila za ponastavitev gesla so bila poslana na e-mail naslov ' +
                            user.email +
                            '.'
                    );
                    done(err, 'done');
                });
            },
        ],
        err => {
            if (err) return next(err);
            res.redirect('/admin/forgot');
        }
    );
});

router.get('/reset/:token', (req, res) => {
    User.findOne(
        { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
        (err, user) => {
            if (err) {
                req.flash('error', 'Nekaj je šlo narobe.');
                return res.redirect('back');
            }
            if (!user) {
                req.flash('error', 'Žeton za ponastavitev gesla je napačen ali pa ni več aktiven.');
                return res.redirect('/admin/forgot');
            }
            res.render('admin/reset', { token: req.params.token });
        }
    );
});

router.post('/reset/:token', (req, res) => {
    async.waterfall(
        [
            done => {
                User.findOne(
                    {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() },
                    },
                    (err, user) => {
                        if (err) {
                            req.flash('error', 'Nekaj je šlo narobe.');
                            return res.redirect('back');
                        }
                        if (!user) {
                            req.flash(
                                'error',
                                'Žeton za ponastavitev gesla je napačen ali pa ni več aktiven.'
                            );
                            return res.redirect('back');
                        }
                        if (req.body.password === req.body.confirm) {
                            user.setPassword(req.body.password, err => {
                                if (err) {
                                    req.flash('error', 'Nekaj je šlo narobe.');
                                    return res.redirect('back');
                                }
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpires = undefined;

                                user.save(err => {
                                    if (err) {
                                        req.flash('error', 'Nekaj je šlo narobe.');
                                        return res.redirect('back');
                                    }
                                    req.logIn(user, err => {
                                        done(err, user);
                                    });
                                });
                            });
                        } else {
                            req.flash('error', 'Gesli se ne ujemata.');
                            return res.redirect('back');
                        }
                    }
                );
            },
            (user, done) => {
                const smtpTransport = nodemailer.createTransport({
                    host: 'mail.macjahisa.si',
                    port: 26,
                    secure: false,
                    tls: {
                        rejectUnauthorized: false,
                    },
                    auth: {
                        user: process.env.NOTIF_MAIL,
                        pass: process.env.NOTIF_MAIL_PW,
                    },
                });
                const mailOptions = {
                    to: user.email,
                    from: process.env.NOTIF_MAIL,
                    subject:
                        'Vaše geslo za administrativno stran (CMS) Mačja hiša je bilo spremenjeno',
                    text:
                        'Obveščamo vas, da je bilo geslo za račun z e-mail naslovom ' +
                        user.email +
                        ' ravnokar spremenjeno.\n',
                };
                smtpTransport.sendMail(mailOptions, err => {
                    req.flash('success', 'Geslo je bilo uspešno spremenjeno.');
                    done(err);
                });
            },
        ],
        err => {
            if (err) {
                req.flash('error', 'Nekaj je šlo narobe.');
                return res.redirect('back');
            }
            res.redirect('/admin/muce/iscejo');
        }
    );
});
// END SPREMEMBA POZABLJENEGA GESLA

// NASLOVNICE
router.get('/naslovnice', middleware.isPageEditor, (req, res) => {
    // prikaži vse vsebine po vrsti od nazadnje spremenjene
    Naslovnica.find({}, (err, naslovnice) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }
        // preglej katere so aktivne
        let prva;
        let druga;
        let tretja;

        naslovnice.map(naslovnica => {
            if (naslovnica.pozicija === 1) {
                prva = naslovnica;
            }
            if (naslovnica.pozicija === 2) {
                druga = naslovnica;
            }
            if (naslovnica.pozicija === 3) {
                tretja = naslovnica;
            }
        });

        res.render('admin/naslovnice/index', {
            naslovnice: naslovnice,
            prva: prva,
            druga: druga,
            tretja: tretja,
        });
    });
});

router.get('/naslovnice/add', middleware.isPageEditor, (req, res) => {
    res.render('admin/naslovnice/add');
});

router.get('/naslovnice/:id/edit', middleware.isPageEditor, (req, res) => {
    Naslovnica.findById(req.params.id, (err, naslovnica) => {
        if (err) {
            req.flash('error', 'Naslovnice ne najdem v bazi podatkov.');
            return res.redirect('/admin/naslovnice');
        }
        res.render('admin/naslovnice/edit', { naslovnica: naslovnica });
    });
});

router.post('/naslovnice/:id/deactivate', middleware.isPageEditor, (req, res) => {
    Naslovnica.findById(req.params.id, (err, naslovnica) => {
        if (err) {
            req.flash('error', 'Naslovnice ne najdem v bazi podatkov.');
            return res.redirect('/admin/naslovnice');
        }
        naslovnica.pozicija = 0;
        naslovnica.save(err => {
            if (err) return handleError(err);
            // saved!
        });
        req.flash('success', 'Naslovnica deaktivirana.');
        return res.redirect('/admin/naslovnice');
    });
});

router.post(
    '/naslovnice',
    middleware.isPageEditor,
    upload_naslovnice.single('naslovnica[ozadje]'),
    (req, res, next) => {
        Naslovnica.count({}, (err, count) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri kreiranju naslovnice.');
                return res.redirect('/admin/naslovnice');
            }

            Naslovnica.create(req.body.naslovnica, (err, naslovnica) => {
                if (err) {
                    req.flash('error', 'Prišlo je do napake pri kreiranju naslovnice.');
                    return res.redirect('/admin/naslovnice');
                }

                const dbid = count + 1;
                naslovnica.dbid = dbid;
                naslovnica.cssBackgroundPositionVertical = req.body.rangeInput;

                if (req.file) {
                    naslovnica.ozadje = req.file.filename.replace(/[ )(]/g, '');
                }

                naslovnica.save(err => {
                    if (err) {
                        console.log(err);
                        req.flash('error', 'Prišlo je do napake pri ustvarjanju naslovnice.');
                        return res.redirect('/admin/naslovnice');
                    }
                });

                req.flash('success', 'Naslovnica dodana.');
                res.redirect('/admin/naslovnice');
            });
        });
    }
);

router.put(
    '/naslovnice/:id',
    middleware.isPageEditor,
    upload_naslovnice.single('naslovnica[ozadje]'),
    (req, res, next) => {
        Naslovnica.findByIdAndUpdate(req.params.id, req.body.naslovnica, (err, naslovnica) => {
            if (err) {
                req.flash('error', 'Prišlo je do napake pri posodabljanju naslovnice.');
                return res.redirect('/admin/naslovnice');
            }

            if (req.file) {
                const ozadje = req.file.filename.replace(/[ )(]/g, '');
                naslovnica.ozadje = ozadje;
            }

            naslovnica.externalURL = req.body.externalURL === 'on';
            naslovnica.cssBackgroundPositionVertical = req.body.rangeInput;
            naslovnica.datum = Date.now();

            naslovnica.save(err => {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Prišlo je do napake pri posodabljanju naslovnice.');
                    return res.redirect('/admin/naslovnice');
                }
            });

            req.flash('success', 'Naslovnica posodobljena.');
            res.redirect('/admin/naslovnice/');
        });
    }
);

router.post('/naslovnice/:pozicija/:id', middleware.isPageEditor, (req, res, next) => {
    Naslovnica.find({}, (err, naslovnice) => {
        if (err) {
            req.flash('error', 'Prišlo je do napake v bazi podatkov.');
            return res.redirect('/admin/login');
        }

        // umakni pozicijo pri dosedanji naslovnici
        naslovnice.map(dosedanja_naslovnica => {
            if (dosedanja_naslovnica.pozicija === Number(req.params.pozicija)) {
                dosedanja_naslovnica.pozicija = 0;
                dosedanja_naslovnica.save(err => {
                    if (err) return handleError(err);
                    // saved!
                });
            }
        });

        // najdi novo in dodeli pozicijo
        Naslovnica.findById(req.params.id, (err, nova_naslovnica) => {
            nova_naslovnica.pozicija = Number(req.params.pozicija);
            nova_naslovnica.save(err => {
                if (err) return handleError(err);
                // saved!
            });
            req.flash('success', 'Naslovnice na prvi strani posodobljene.');
            res.send({ redirect: '/admin/naslovnice' });
        });
    });
});

// END NASLOVNICE

module.exports = router;
