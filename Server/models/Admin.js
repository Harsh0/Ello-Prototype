var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminDetailsSchema = new Schema({
  username: {type:String, required: true, index: { unique: true }},
  password: {type:String, required: true}
});
module.exports = mongoose.model('admindetails',adminDetailsSchema);
