var _ = require('lodash');
module.exports = function(route,request){
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
          //post
        }else{
          //put
        }
      },
      raw:function(){
        return _data;
      }
    }
}
