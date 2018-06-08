var mongoose = require("mongoose");

var naslovnicaSchema = new mongoose.Schema({
  datum: {type: Date, default: Date.now()},
  ozadje: String,
  naslov: String,
  podnaslov: String,
  napisNaGumbu: String,
  povezava: String,
  externalURL: Boolean,
  pozicija: {type: Number, default: 0},
  dbid: Number
});

module.exports = mongoose.model("Naslovnica", naslovnicaSchema);
