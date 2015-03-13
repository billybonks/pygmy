
var RSVP = require('rsvp');
var inflection = require('inflection');
module.exports = function(pygmy,route,request){
  var _onRequestError = function(reject){
    return function(error){
      reject(error)
    }
  }
  return {
    _path:'/'+route,
    lookupRelationship:function(route,method,parameter){
      return pygmy[inflection.pluralize(route)][method](parameter)
    },
    find:function(id){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path+'/'+id}).then(_self._onSingular.call(_self,resolve),_onRequestError(reject))
      });
    },
    all:function(){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path}).then(_self._onPlural.call(_self,resolve),_onRequestError(reject))
      });
    },
    findMany:function(ids){
      return this.where({'ids':ids})
    },
    where:function(params){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.where(_self._path,params).then(_self._onPlural.call(_self,resolve),_onRequestError(reject))
      });
    },
    create:function(model){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.post(model.raw(),_self._path).then(_self._onUpdate.call(_self,resolve,model),_onRequestError(reject));
      });
    },
    update:function(params){
      return new RSVP.Promise(function(resolve,reject){
        request.put(model.raw(),_path).then(_self._onUpdate.call(_self,resolve,model),_onRequestError(reject));
      });
    },
    delete:function(id){
      return request.delete(this._path+'/'+id)
      //https://go.tradegecko.com/ajax/products/3542640
    },
    buildMany:function(objArray){
      _self = this;
      return objArray.map(function(object){
        return _self.build(object)
      })
    },
    build:function(params){
      var model =  require('./model')(this).build(params)
      return model
    },
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
    _onUpdate:function(resolve,model){
      var _self = this;
      return function(payload){
        resolve(model.merge(payload[inflection.singularize(route)]))
      }
    },
    _parsePayload :function(payload){
        return {
          collection:this.buildMany(payload[route]),
          totla:payload.meta.total
        };
    }
  }
}
