'use strict';

module.exports = function(params){
  var request = require('./request')(params.token,params.cleintId,params.secret)
  return {
    products: require('./routes/products')(request)
  }
}
