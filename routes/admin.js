var express = require("express");
var router = express.Router({mergeParams: true});
var Muca = require("../models/muca");

router.get("/", function(req, res){
  // index - preusmeri na seznam muc
  res.redirect("/admin/muce");
});

router.get("/muce", function(req, res){
  // prikaži vse muce po vrsti od nazadnje sprejete
  Muca.find({}).sort({datum: -1}).exec(function(err, muce) {
    if(err) return console.log(err);
    res.render("admin/muce/index", {muce: muce});
  })
});

router.get("/muce/edit/:id", function(req, res) {
  // prikaži obrazce za urejanje muce (po IDju)
  Muca.findById(req.params.id, function(err, muca) {
    if(err) return console.log(err);
    res.render("admin/muce/edit", {muca: muca});
  })
});

router.get("/muce/:id", function(req, res) {
  // prikaži muco po IDju
  Muca.findById(req.params.id, function(err, muca) {
    if(err) return console.log(err);
    res.render("admin/muce/show", {muca: muca});
  })
});

router.get("/muce/add", function(req, res){
  // prikaži obrazec za novo muco
  res.render("admin/muce/add");
});

router.post("/muce", function(req, res){
  // dodaj novo muco
  Muca.create(req.body.muca, function(err, novaMuca) {
    if(err) return console.log(err);
    res.redirect("/admin/muce");
  });
});

module.exports = router;
