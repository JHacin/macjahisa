var mongoose = require("mongoose");

var novicaSchema = new mongoose.Schema({
  dbid: Number,
  datum: Date,
  user_id: Number,
  naslov: String,
  vsebina: String,
  naslovna_slika: String,
  naslov_en: String,
  vsebina_en: String,
  objava: String
});

module.exports = mongoose.model("Novica", novicaSchema);