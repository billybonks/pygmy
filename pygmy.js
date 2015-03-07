'use strict';
module.exports = function(token,secret,secret){
  return {
    companies: require('./routes/companies');
    products: require('./routes/products');
  }
}
