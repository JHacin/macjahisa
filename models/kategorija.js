var mongoose = require("mongoose");

var kategorijaSchema = new mongoose.Schema({
  naslov: String,
  url: String,
  nav_vrstni_red: Number,
  podstrani_length: {type: Number, default: 0}
});

module.exports = mongoose.model("Kategorija", kategorijaSchema);
