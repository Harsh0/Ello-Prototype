var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tailorDetailsSchema = new Schema({
  name:{first:String,last:String},
  email:{type:String,required:true,index:{unique:true}},
  mobile:{type:String,required:true,index:{unique:true}},
  username: {type:String, required: true, index: { unique: true }},
  password: {type:String, required: true},
  status:String
});
module.exports = mongoose.model('tailordetails',tailorDetailsSchema);
