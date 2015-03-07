request = require('./../request')
route = '/products'
exports.all = function (){
  request.get({path:route});
}
