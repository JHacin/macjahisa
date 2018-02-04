var mongoose = require("mongoose");

var izobrazevanjeSchema = new mongoose.Schema({
  datum: {type: Date, default: Date.now()},
  naslov: String,
  naslovna_slika: String,
  datoteka: String,
  objava: String
});

module.exports = mongoose.model("Izobrazevalna_vsebina", izobrazevanjeSchema);
