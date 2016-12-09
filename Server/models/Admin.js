var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminDetailsSchema = new Schema({
  username: {type:String, required: true, index: { unique: true }},
  password: {type:String, required: true},
  createdAt:{type:Date,default:Date.now()}
});
module.exports = mongoose.model('admindetails',adminDetailsSchema);
