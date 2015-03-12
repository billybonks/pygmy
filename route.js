
var RSVP = require('rsvp');

module.exports = function(route,request){
  var helper = require( './helper' )(route,request);
  
  var _onSingular = helper._onSingular;
  var _onPlural = helper._onPlural;
  var _onRequestError = helper._onRequestError;
  var _parsePayload = helper._parsePayload;

  return {
    _path:'/'+route,
    find:function(id){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path+'/'+id}).then(_onSingular.call(helper,resolve),_onRequestError(reject))
      });
    },
    all:function(){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.get({path:_self._path}).then(_onPlural.call(helper,resolve),_onRequestError(reject))
      });
    },
    findMany:function(ids){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.where(_self._path,{'ids':ids}).then(_onPlural.call(helper,resolve),_onRequestError(reject))
      });
    },
    where:function(params){
      _self = this;
      return new RSVP.Promise(function(resolve,reject){
        request.where(_self._path,params).then(_onPlural.call(helper,resolve),_onRequestError(reject))
      });
    },
    build:helper.build
  }
}
