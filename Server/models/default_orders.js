var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema = new Schema({
  title:{type:String, required: true},
  occation:[String],/* Business ,casual, formal, wedding, Play */
  season:String,/*fall/winter, spring/summer *//*not necessary to show to user */
  imagesUrl:[],/*0th index contain main image, 1st index contain fabric image, two more image at diffrent angle is necessary */
  category:String,/* set by middleware by default to Shirt */
  details:{
    fabric:String,
    colour:String,
    pattern:{type:String, required: true}, /*Check, Solid, Stripe, Subtle/Pattern */
  },
  description:{type:String, required: true},
  cost:{type:Number, required: true},/*in rupees set by tailor */
  tailorId:{type:String, required: true},
  status:String /*active ot inActive */
});
module.exports = mongoose.model('def_order',orderSchema);
