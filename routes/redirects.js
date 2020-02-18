const express = require('express');
const router = express.Router({ mergeParams: true });

router.get('/index.php', function(req, res) {
    res.redirect('/');
});

router.get('/kontakt.php', function(req, res) {
    res.redirect('/o-nas/kdo-smo');
});

router.get('/o_macji_hisi.php', function(req, res) {
    res.redirect('/o-nas/kdo-smo');
});

router.get('/muce_za_posvojitev.php', function(req, res) {
    res.redirect('/posvojitev/muce');
});

router.get('/postopek_posvojitve.php', function(req, res) {
    res.redirect('/posvojitev/pogoji-in-postopek');
});

router.get('/v_novem_domu.php', function(req, res) {
    res.redirect('/v-novem-domu/1');
});

router.get('/v_novem_domu.php*', function(req, res) {
    res.redirect('/v-novem-domu/1');
});

router.get('/dobro_je_vedeti.php', function(req, res) {
    res.redirect('/dobro-je-vedeti/prispevki-clanki-povezave');
});

router.get('/sterilizacije_in_kastracije.php', function(req, res) {
    res.redirect('/dobro-je-vedeti/sterilizacija-kastracija');
});

router.get('/izobrazevanje.php', function(req, res) {
    res.redirect('/dobro-je-vedeti/zbirka-macje-hise');
});

router.get('/letaki.php', function(req, res) {
    res.redirect('/dobro-je-vedeti/letaki');
});

router.get('/vasa_pomoc.php', function(req, res) {
    res.redirect('/pomoc/nacini-pomoci');
});

router.get('/v_medijih.php', function(req, res) {
    res.redirect('/o-nas/v-medijih');
});

router.get('/enovice.php', function(req, res) {
    res.redirect('http://eepurl.com/dskgr1');
});

router.get('/novice.php', function(req, res) {
    res.redirect('/');
});

router.get('/muce_za_posvojitev.php?id=*', function(req, res) {
    res.redirect('/posvojitev/muce');
});

router.get('/clanek.php*', function(req, res) {
    res.redirect('/dobro-je-vedeti/prispevki-clanki-povezave');
});

router.get('/donacija_obrazec_fiz.php', function(req, res) {
    res.redirect('/pomoc/donacije');
});

router.get('/donacija_obrazec_pr.php', function(req, res) {
    res.redirect('/pomoc/donacije');
});

router.get('/*.php*', function(req, res) {
    res.redirect('/');
});

router.get('/dobrodelni-koncert', function(req, res) {
    res.redirect('/pomoc/dobrodelni-koncert');
});

router.get('/zbiramo-za-zavetisce', (req, res) => {
    res.redirect('/pomoc/zbiramo-za-zavetisce');
});

router.get('/posvojitev', function(req, res) {
    res.redirect('/posvojitev/muce');
});

router.get('/o-nas', function(req, res) {
    res.redirect('/o-nas/kdo-smo');
});

router.get('/projekt-vita', function(req, res) {
    res.redirect('/projekt-vita/predstavitev');
});

module.exports = router;
