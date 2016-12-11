var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userDetailsSchema = new Schema({
  name:String,
  email:{type:String,required:true,index:{unique:true}},
  mobile:{type:String,required:true,index:{unique:true}},
  password: {type:String, required: true},
  orders:[String]
});
module.exports = mongoose.model('userdetails',userDetailsSchema);
