var mongoose = require("mongoose");

var kategorijaSchema = new mongoose.Schema({
  naslov: String,
  url: String,
  podstrani: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Podstran"
    }
  ]
});

module.exports = mongoose.model("Kategorija", kategorijaSchema);
