const { Schema, model, Document } = require('mongoose');

//interface IUser extends Document {
//  email: string;
//  password: {
//    salt: string,
//    hash: string,
//  };
//}

const userSchema = {
  email: { type: String, unique: true, lowercase: true },
  password: {
    salt: String,
    hash: String,
  },
};

const User = model('User', userSchema);

module.exports = User;
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
//const crypto = require('crypto');

//const UserSchema = new Schema({
//  email: { type: String, unique: true, lowercase: true },
//  name: { type: String },
//  hash: String,
//  salt: String,
//});

//UserSchema.methods.setPassword = function (password) {
//  this.salt = crypto.randomBytes(16).toString('hex');
//  this.hash = crypto
//    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
//    .toString('hex');
//};

//UserSchema.methods.validPassword = function (password) {
//  var hash = crypto
//    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
//    .toString('hex');

//  return this.hash === hash;
//};

//const UserModel = mongoose.model('User', UserSchema);

//module.exports = UserModel;
