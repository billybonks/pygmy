route = require('./route')

module.exports = function(request){
  return {
    build:function(name){
      return route(name,request);
    }
  }
}
