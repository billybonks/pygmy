module.exports = function(route,request){
    return {
      _path:'/'+route,
      all:function(){
        return request.get({path:this._path});
      },
      find:function(id){
        return request.get({path:this._path+'/'+id});
      },
      findMany:function(ids){
        return request.where(this._path,{'ids':ids});
      },
      where:function(params){
        return request.where(this._path,params);
      },
      build:function(params){

      }
    }
}
