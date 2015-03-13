var route = require('./route');

module.exports = function(request){
  return {
    build:function(pygmy,name){
      return route(pygmy,name,request);
    }
  };
};
