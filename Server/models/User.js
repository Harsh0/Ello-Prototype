var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userDetailsSchema = new Schema({
  name:String,
  email:{String,required:true,index:{unique:true}},
  mobile:{String,required:true,index:{unique:true}},
  password: {type:String, required: true},
  createdAt:{type:Date,default:Date.now()}
});
module.exports = mongoose.model('userdetails',userDetailsSchema);
