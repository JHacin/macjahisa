var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");

router.get("/", function(req, res){
  res.redirect("/projekt-vita/predstavitev");
});

router.get("/:podstran", function(req, res){

  Podstran.findOne({url: req.params.podstran}, function(err, podstran){
    if(podstran===null) return res.render("404");
    res.render("projekt-vita/show",
    {
      podstran: podstran,
      sidebar_muce: req.sidebar_muce,
      title: podstran.naslov + " | Mačja hiša"
    });
  });
});

module.exports = router;
