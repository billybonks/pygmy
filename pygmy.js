'use strict';

module.exports = function(params){
  var request = require('./request')(params.token,params.cleintId,params.secret)
  var route = require('./routes')(request);
  return {
    products: route.build('products')
  }
}
