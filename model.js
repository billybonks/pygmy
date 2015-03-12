var _ = require('lodash');
var RSVP = require('rsvp');
module.exports = function(route){
    var _data={};
    return {
      isDirty:false,
      build:function(params){
        _.merge(_data,params);
        return this;
      },
      get:function(attribute){
        return _data[attribute];
      },
      set:function(attribute,value){
        _data[attribute] = value;
        this.isDirty = true;
      },
      isPersisted:function(){
        if(this.get('id') && !this.isDirty)
          return true;
        return false;
      },
      save:function(){
        if(this.id){
          console.log('update')
          return route.update(this)
        }else{
          return route.create(this)
        }
      },
      raw:function(){
        return _data;
      },
      merge:function(params){
        console.log(params)
        _.merge(_data,params);
        console.log(_data)
        return this;
      }
    }
}
