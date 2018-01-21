var express         = require("express"),
    ejs             = require("ejs"),
    mongoose        = require("mongoose"),
    app             = express(),
    bodyParser      = require("body-parser"),
    moment          = require("moment"),
    Novica          = require("./models/novica"),
    Muca            = require("./models/muca");

// Route handling vars
var o_nas = require("./routes/o_nas.js");
var posvojitev = require("./routes/posvojitev.js");
var dobro_je_vedeti = require("./routes/dobro_je_vedeti.js");
var pomoc = require("./routes/pomoc.js");
var vita = require("./routes/vita.js");
var admin = require("./routes/admin.js");
var novice = require("./routes/novice.js");

// CONFIG
mongoose.connect("mongodb://localhost/macjahisa");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.locals.moment = require('moment');

// find all news middleware
app.use("*", function(req, res, next) {
  Novica.find({}).sort({datum: -1}).limit(4).exec(function(err, sidebar_novice) {
    if(err) return console.log(err);
    req.sidebar_novice = sidebar_novice;
    next();
  })
});

// find all cats middleware
app.use("*", function(req, res, next) {
  Muca.find().where("status").in([1, 2]).sort({datum: -1}).limit(3).exec(function(err, sidebar_muce) {
    if(err) return console.log(err);
    req.sidebar_muce = sidebar_muce;
    next();
  })
});

// INDEX ROUTE
app.get("/", function(req, res){
  var params = {
    title: "Mačja hiša - skupaj pomagamo brezdomnim mucam"
  }
  res.render("index", params);
});

// OTHER routes
app.use("/o_nas/", o_nas);
app.use("/posvojitev/", posvojitev);
app.use("/dobro_je_vedeti/", dobro_je_vedeti);
app.use("/pomoc/", pomoc);
app.use("/vita/", vita);
app.use("/admin/", admin);
app.use("/novice/", novice);



// app listen config
app.listen(process.env.PORT || 3001, process.env.IP, function(){
    console.log("Starting.");
});
