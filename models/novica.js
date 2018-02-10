var mongoose = require("mongoose");

var novicaSchema = new mongoose.Schema({
  dbid: Number,
  datum: {type: Date, default: Date.now()},
  user_id: Number,
  naslov: String,
  vsebina: String,
  naslovna_slika: {type: String, default: "default.png"},
  naslov_en: String,
  vsebina_en: String,
  objava: String
});

module.exports = mongoose.model("Novica", novicaSchema);
