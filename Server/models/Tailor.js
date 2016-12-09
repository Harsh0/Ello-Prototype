var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tailorDetailsSchema = new Schema({
  name:{first:String,last:String},
  email:{String,required:true,index:{unique:true}},
  mobile:{String,required:true,index:{unique:true}},
  username: {type:String, required: true, index: { unique: true }},
  password: {type:String, required: true},
  createdAt:{type:Date,default:Date.now()}
});
module.exports = mongoose.model('tailordetails',tailorDetailsSchema);
