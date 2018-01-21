var express = require("express");
var router  = express.Router({mergeParams: true});
var Novica = require("../models/novica");

router.get("/", function(req, res){
  Novica.find({}, function(err, novice){
    res.render("novice/index",
    { novice: novice,
      sidebar_novice: req.sidebar_novice,
      sidebar_muce: req.sidebar_muce,
      title: "Novice | Mačja hiša"});
  });

});


module.exports = router;
