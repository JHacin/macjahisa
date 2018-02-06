var express             = require("express");
var router              = express.Router({mergeParams: true});
var Podstran = require("../models/podstran");
var Muca = require("../models/muca");

// router.get("/", function(req, res){
//   Podstran.findOne({url: "v_novem_domu"}, function(err, podstran){
//     Muca.find().where("status").equals(4).sort({datum: -1}).exec(function(err, muce){
//       res.render("v_novem_domu/index",
//       {
//         muce: muce,
//         podstran: podstran,
//         nav_kategorije: req.nav_kategorije,
//         nav_podstrani: req.nav_podstrani,
//         sidebar_novice: req.sidebar_novice,
//         sidebar_muce: req.sidebar_muce,
//         title: podstran.naslov + " | Mačja hiša"
//       });
//     });
//   });
// });

router.get("/:page", function(req, res, next){
  var perPage = 9;
  var page = req.params.page || 1;

  // najdi podstran
  Podstran.findOne({naslov: "V novem domu"}, function(err, podstran){
    // najdi muce po 9 naenkrat
    Muca
      .find({})
      .where("status").equals(4)
      .sort({datum: -1})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, muce){
        Muca.where("status").equals(4).count().exec(function(err, count){
          if(err) return next(err);
          res.render("v_novem_domu/index", {
            podstran: podstran,
            title: podstran.naslov + " | Mačja hiša",
            nav_kategorije: req.nav_kategorije,
            nav_podstrani: req.nav_podstrani,
            sidebar_novice: req.sidebar_novice,
            sidebar_muce: req.sidebar_muce,
            muce: muce,
            current: page,
            pages: Math.ceil(count / perPage),
            stevilo: count
          });
        });
    });
  });
});

module.exports = router;
