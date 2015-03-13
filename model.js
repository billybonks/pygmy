var _ = require('lodash');
module.exports = function(route){
    var _data={};
    return {
      isDirty:false,
      build:function(params){
        _.merge(_data,params);
        return this;
      },
      get:function(attribute){
        var singular = attribute+'_id';
        var plural = attribute+'_ids';
        if(attribute in _data){
          return _data[attribute];
        }else if(singular in _data){
          return route.lookupRelationship(attribute,"find",_data[singular]);
        }else if(plural in _data){
          return route.lookupRelationship(attribute,"findMany",_data[plural]);
        }
        return null;
      },
      set:function(attribute,value){
        _data[attribute] = value;
        this.isDirty = true;
      },
      isPersisted:function(){
        if(this.get('id') && !this.isDirty){
          return true;
        }
        return false;
      },
      save:function(){
        if(this.id){
          return route.update(this);
        }else{
          return route.create(this);
        }
      },
      delete:function(){
        return route.delete(_data.id);
      },
      raw:function(){
        return _data;
      },
      merge:function(params){
        _.merge(_data,params);
        return this;
      }
    };
};
