var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Muca = require("../models/muca");

router.get("/", function(req, res){
  Podstran.findOne({url: "v_novem_domu"}, function(err, podstran){
    Muca.find().where("status").equals(4).sort({datum: -1}).exec(function(err, muce){
      res.render("v_novem_domu/index",
      {
        muce: muce,
        podstran: podstran,
        nav_kategorije: req.nav_kategorije,
        nav_podstrani: req.nav_podstrani,
        sidebar_novice: req.sidebar_novice,
        sidebar_muce: req.sidebar_muce,
        title: podstran.naslov + " | Mačja hiša"
      });
    });
  });
});

module.exports = router;
