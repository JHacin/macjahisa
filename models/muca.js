var mongoose = require("mongoose");

var mucaSchema = new mongoose.Schema({
  dbid: Number,
  user_id: Number,
  datum: Date,
  status: Number,
  ime: String,
  nacin_posvojitve: String,
  mesec_rojstva: Date,
  starost: String,
  id_starostne_kategorije: Number,
  spol: Number,
  opis: String,
  kontakt: String,
  file_name1: String,
  file_name2: String,
  file_name3: String,
  file_name4: String,
  posvojitev_na_daljavo: Number,
  posvojitev_na_daljavo_zgodovina: Number,
  objavi_zgodbo: Number,
  zgodba: String,
  zgodba_file_name1: String,
  zgodba_file_name2: String,
  zgodba_file_name3: String,
  last_update: Date,
  add_date: Date,
  vet: {
    s_k: { type: Boolean, default: false },
    cipiranje: { type: Boolean, default: false },
    cepljenje: { type: Boolean, default: false },
    razparazit: { type: Boolean, default: false },
    felv: { type: Boolean, default: false },
    fiv: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model("Muca", mucaSchema);
