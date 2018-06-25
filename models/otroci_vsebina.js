var mongoose = require("mongoose");

var otrocivsebinaSchema = new mongoose.Schema({
  datum: {type: Date, default: Date.now()},
  kategorija: String,
  naslovna_slika: String,
  naslov: String,
  datoteka: String,
  objava: String
});

module.exports = mongoose.model("Otroci_vsebina", otrocivsebinaSchema);
