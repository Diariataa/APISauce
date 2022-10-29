const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//Models des users
const userSchema = mongoose.Schema({
//L"email doit etre unique //plusieur users pourrait utiliser
// la mm adresse donc on fait un unique true
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//PlugIn pour n'avoir qu'un email unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);