var User = require('../models/User');
var Admin = require('../models/Admin');
var Tailor = require('../models/Tailor');
var errorDataFormatMsg = 'Data not in Correct format, Try again';/* message need to be less in size to be done at later point of time */
var validation = {
  /* user validation function */
  userVal:function(user){
    /* check that all data are sent */
    if(user.email&&user.mobile&&user.password&&user.name){
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;/* email regular expression */
      var mobileRegex = /^(7|8|9)\d{9}$/; /* mobile regular expression */
      /*var passwordRegex = new RegExp('regex for password');/* password regular expression */
      /* check whether password format is ok */
      /* return data formation error */
      /* can be done later */

      /* check whether email id format is ok */
      /* return data formation error */
      if(!emailRegex.test(user.email)){
        return errorDataFormatMsg;
      }
      /* check whether mobile format is ok */
      /* return data formation error */
      if(!mobileRegex.test(user.mobile)){
        return errorDataFormatMsg;
      }
      /* if all fields are OK */
      return 'OK';
    }
    else{
      return 'Lack of data fields, Try again';
    }
  },
  tailorVal:function(tailor){
    return 'OK';
  }
}
module.exports = validation;
