var inflection = require( 'inflection' );
module.exports = function(route,request){

  return{
    _onSingular:function(resolve){
      var _self = this;
      return function(payload){
          resolve(_self.build(payload[inflection.singularize(route)]))
      }
    },
    _onPlural:function(resolve){
      var _self = this;
      return function(payload){
          //TODO: Breaks if not array and if array is null
          var collection = _self._parsePayload.call(_self,payload)
          resolve(collection)
      }
    },
    _onRequestError : function(reject){
      return function(error){
        reject(error)
      }
    },
    _parsePayload :function(payload){
        return {
          collection:this.buildMany(payload[route]),
          totla:payload.meta.total
        };
    },
    buildMany:function(objArray){
      _self = this;
      return objArray.map(function(object){
        return _self.build(object)
      })
    },
    build:function(params){
      return require('./model')(route,request).build(params)
    }
  }
}
