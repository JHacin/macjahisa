var mongoose = require("mongoose");

var clanekSchema = new mongoose.Schema({
  dbid: Number,
  user_id: Number,
  datum: Date,
  naslov: String,
  vsebina: String,
  naslov_en: String,
  vsebina_en: String,
  objava: String,
  tip: String
});

module.exports = mongoose.model("Clanek", clanekSchema);
