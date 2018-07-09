var mongoose = require("mongoose");

var kontaktSchema = new mongoose.Schema({
  ime: String,
  email: { type: String, default: "posvojitev@macjahisa.si" },
  tel: String
});

module.exports = mongoose.model("Kontakt", kontaktSchema);
