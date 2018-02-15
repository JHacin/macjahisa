var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    adminLevel: String
});

userSchema.plugin(passportLocalMongoose);

// enable password change
userSchema.methods.changePassword = function(oldPassword, newPassword, cb) {
  if (!oldPassword || !newPassword) {
    return cb("Eno od gesel manjka");
  }

  var self = this;

  this.authenticate(oldPassword, function(err, authenticated) {
    if (err) { return cb(err); }

    if (!authenticated) {
      return cb("Napačno staro geslo.");
    }

    self.setPassword(newPassword, function(setPasswordErr, user) {
      if (setPasswordErr) { return cb(setPasswordErr); }

      self.save(function(saveErr) {
        if (saveErr) { return cb(saveErr); }

        cb(null, user);
      });
    });
  });
};

module.exports = mongoose.model("User", userSchema);
