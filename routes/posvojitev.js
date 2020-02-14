var express = require("express");
var router = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Muca = require("../models/muca");

router.get("/", function(req, res){
  res.redirect("/posvojitev/muce");
});

// Seznam muc
router.get("/muce", function(req, res){
  Podstran.findOne({naslov: "Muce, ki iščejo dom"}, function(err, podstran){
    Muca.find().where("status").in([1, 2]).sort({datum_objave: -1}).exec(function(err, muce){
      if(err) return res.render("500");
      res.render("posvojitev/muce", {
        podstran: podstran,
      sidebar_muce: req.sidebar_muce, title: "Muce, ki iščejo dom | Mačja hiša",
      muce: muce, needsJpList: true})
    });
  });
});

// Individualna muca
router.get("/muce/:id", function(req, res){
  Muca.findOne({dbid: req.params.id}, function (err, muca){
    if(muca===null) return res.render("404");
    if(err) return res.render("500");
    res.render("posvojitev/prikaz", {
      muca: muca,
      sidebar_muce: req.sidebar_muce,
      title: muca.ime + " | Mačja hiša",
      social_description: muca.opis.replace(/<(?:.|\n)*?>/gm, ''),
      social_image: "http://" + req.headers.host + "/files/oglasi_muce/" + muca.file_name1,
      needsSlickSlider: true
    });
  });
});

// Pogoji in postopki etc.
router.get("/:podstran", function(req, res){
  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(podstran===null) return res.render("404");
    if(err) return res.render("500");
    res.render("posvojitev/show",
    {
      podstran: podstran,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
