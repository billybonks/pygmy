route = '/products'

module.exports = function(request){
  return {
    all:function(){
      return request.get({path:route});
    },
    find:function(id){
      return request.get({path:route+'/'+id});
    },
    findMany:function(ids){
      return request.where(route,{'ids':ids});
    },
    where:function(params){
      return request.where(route,params);
    }
  }
}
