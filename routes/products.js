route = '/products'

module.exports = function(request){
  return {
    all:function(){
      return request.get({path:route});
    }
  }
}
