var express             = require("express");
var router              = express.Router({mergeParams: true});

router.get("/pogoji_in_postopek", function(req, res){
  res.render("posvojitev/pogoji_in_postopek", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Pogoji in postopek posvojitve | Mačja hiša"})
});

router.get("/muce", function(req, res){
  res.render("posvojitev/muce", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Muce, ki iščejo dom | Mačja hiša"})
});

// Začasno !!!!!!
router.get("/prikaz", function(req, res){
  res.render("posvojitev/prikaz", {sidebar_novice: req.sidebar_novice, sidebar_muce: req.sidebar_muce, title: "Muca #1 | Mačja hiša"})
});
// Začasno !!!!!

module.exports = router;
