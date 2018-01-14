var express = require("express"),
    ejs     = require("ejs"),
    app     = express();

// Route handling vars
var o_nas = require("./routes/o_nas.js");
var posvojitev = require("./routes/posvojitev.js");
var dobro_je_vedeti = require("./routes/dobro_je_vedeti.js");
var pomoc = require("./routes/pomoc.js");
var vita = require("./routes/vita.js");
var admin = require("./routes/admin.js");

// CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

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

// app listen config
app.listen(process.env.PORT || 3001, process.env.IP, function(){
    console.log("Starting.");
});
