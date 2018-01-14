var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/pogoji_in_postopek", function(req, res){
  res.render("posvojitev/pogoji_in_postopek", {title: "Pogoji in postopek posvojitve | Mačja hiša"})
});

router.get("/muce", function(req, res){
  res.render("posvojitev/muce", {title: "Muce, ki iščejo dom | Mačja hiša"})
});

module.exports = router;
