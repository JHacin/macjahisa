var express = require("express");
var router = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Muca = require("../models/muca");

router.get("/", function(req, res){
  res.redirect("/posvojitev/muce");
});

router.get("/muce", function(req, res){
  Podstran.findOne({naslov: "Muce, ki iščejo dom"}, function(err, podstran){
    Muca.find().where("status").in([1, 2]).sort({datum: -1}).exec(function(err, muce){
      if(err) return console.log(err);
      res.render("posvojitev/muce", {podstran: podstran, nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani, sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce, title: "Muce, ki iščejo dom | Mačja hiša",
      muce: muce})
    });
  });
});

router.get("/muce/:id", function(req, res){
  Muca.findOne({dbid: req.params.id}, function (err, muca){
    if(err) return console.log(err);
    res.render("posvojitev/prikaz", {
      muca: muca,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      title: muca.ime + " | Mačja hiša",
      social_description: muca.opis.replace(/<(?:.|\n)*?>/gm, ''),
      social_image: "http://" + req.headers.host + "/files/oglasi_muce/" + muca.file_name1
    });
  });
});

router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(err) return console.log(err);
    res.render("posvojitev/show",
    {
      podstran: podstran,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
