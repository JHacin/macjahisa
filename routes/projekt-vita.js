var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/", function(req, res){
  res.redirect("/projekt-vita/predstavitev");
});

router.get("/:podstran", function(req, res){

  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    res.render("projekt-vita/show",
    {
      podstran: podstran,
      nav_kategorije: req.nav_kategorije,
      nav_podstrani: req.nav_podstrani,

      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;