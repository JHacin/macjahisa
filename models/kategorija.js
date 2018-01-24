var mongoose = require("mongoose");

var kategorijaSchema = new mongoose.Schema({
  naslov: String,
  podstrani: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Podstran"
    }
  ]
});

module.exports = mongoose.model("Kategorija", kategorijaSchema);
