var mongoose = require("mongoose");

var oskrbnicaSchema = new mongoose.Schema({
  ime: String,
  email: String,
  aktivna: String
});

module.exports = mongoose.model("Oskrbnica", oskrbnicaSchema);
