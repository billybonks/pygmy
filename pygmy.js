module.exports = function(params){
  var request = require('./request')(params.token,params.cleintId,params.secret,'api.tradegecko.com');
  var routes = require('./routes')(request);
  var pygmy = {

  };

  pygmy['products'] = routes.build(pygmy,'products');
  pygmy['companies'] = routes.build(pygmy,'companies');
  pygmy['addresses'] = routes.build(pygmy,'addresses');
  return pygmy;
};
