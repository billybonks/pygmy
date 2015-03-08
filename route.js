var inflection = require( 'inflection' );
var RSVP = require('rsvp');

var _onRequestError = function(reject){

  return function(error){
    reject(error)
  }
}

module.exports = function(route,request){
  return {
    _path:'/'+route,
    find:function(id){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path+'/'+id}).then(function(payload){
          resolve(_self.build(payload[inflection.singularize(route)]))
        },_onRequestError(reject))
      });
    },
    all:function(){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path}).then(function(payload){
            //TODO: Breaks if not array and if array is null
            var collection = _self._parsePayload.call(_self,payload)
            resolve(collection)
        },_onRequestError(reject))
      });
    },
    findMany:function(ids){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.where(_self._path,{'ids':ids}).then(function(payload){
            //TODO: Breaks if not array and if array is null
            var collection = _self._parsePayload.call(_self,payload)
            resolve(collection)
        },_onRequestError(reject))
      });
    },
    where:function(params){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.where(_self._path,params).then(function(payload){
            //TODO: Breaks if not array and if array is null
            var collection = _self._parsePayload.call(_self,payload)
            resolve(collection)
        },_onRequestError(reject))
      });
    },
    build:function(params){
      return require('./model')(route,request).build(params)
    },
    buildMany:function(objArray){
      _self = this;
      return objArray.map(function(object){
        console.log('building')
        return _self.build(object)
      })
    },
    _parsePayload :function(payload){
        return {
          collection:this.buildMany(payload[route]),
          totla:payload.meta.total
        };

      //inflection.singularize(route);
    }
  }
}
