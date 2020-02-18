const mongoose = require('mongoose');

const oskrbnicaSchema = new mongoose.Schema({
  ime: String,
  email: String,
  aktivna: String,
});

module.exports = mongoose.model("Oskrbnica", oskrbnicaSchema);
