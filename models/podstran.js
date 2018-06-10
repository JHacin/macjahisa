var mongoose = require("mongoose");

var podstranSchema = new mongoose.Schema({
  dbid: Number,
  naslov: String,
  vsebina: String,
  naslov_en: String,
  vsebina_en: String,
  zadnja_sprememba: Date,
  vrstni_red: Number,
  include_after: String,
  portal: String,
  include_before: String,
  objava: String,
  url: String,
  kategorija: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kategorija"
  },
  SEOmetaTitle: { type: String, default: "" },
  SEOmetaDescription: { type: String, default: "" },
  SEOfbTitle: { type: String, default: "" },
  SEOfbDescription: { type: String, default: "" },
  SEOtwitterTitle: { type: String, default: "" },
  SEOtwitterDescription: { type: String, default: "" }  
});

module.exports = mongoose.model("Podstran", podstranSchema);
