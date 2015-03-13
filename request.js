var _ = require('lodash');
var RSVP = require('rsvp');
var https = require('https');
module.exports = function(token,id,secret,host){
  return {
    get:get,
    where:where,
    post:post,
    delete:del,
    baseOptions:{
      host:'api.tradegecko.com',
      headers: {
        Authorization: 'Bearer '+ token
      }
    }
  }

  function del(path){
    var _self = this;
    return new RSVP.Promise(function(resolve,reject){
      var req = createRequest.call(_self,{method:'DELETE',path:path},resolve,reject)
      req.end();
    });
  }

  function where (route,params){
    route = route+'?'+serialize(params)
    return this.get({path:route});
  }

  function post(data,path){
    return update.call(this,data,path,'POST');
  }

  function put(data,path){
    return update.call(this,data,path,'PUT');
  }

  function get (params){
    var _self = this;
    return new RSVP.Promise(function(resolve,reject){
      params.method = 'GET'
      var req = createRequest.call(_self,params,resolve,reject)
      req.end();
    });
  }

  function update(data,path,method){
    var _self = this;
    return new RSVP.Promise(function(resolve,reject){
      var headers ={method: 'POST',
                    path:path,
                    headers:{
                      'Content-Length':JSON.stringify(data).length,//Buffer.byteLength(data),
                      'Content-Type':'application/json'
                     }
                    }
      var req = createRequest.call(_self,headers,resolve,reject)
      req.write(JSON.stringify(data));
      req.end();
    });
  }
  function createRequest(params,resolve,reject){
    var req = https.request(_.merge(params,this.baseOptions), function(res) {
      var error
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      switch(res.statusCode){
        case 200:
          res.on('end',function(){
            resolve(JSON.parse(data));
          })
          break;
        case 201:
          res.on('end',function(){
            resolve(JSON.parse(data));
          })
          break;
        case 204:
          resolve({message:'Success',statusCode:res.statusCode})
          break;
        case 400:
          reject({message:'Bad Request',statusCode:res.statusCode});
          break;
        case 401:
          reject({message:'Unauthorized',statusCode:res.statusCode});
          break;
        case 403:
          reject({message:'Forbidden',statusCode:res.statusCode});
          break;
        case 404:
          reject({message:'Not Found',statusCode:res.statusCode});
        case 414:
          reject({message:'Request-URI Too Long',statusCode:res.statusCode});
        case 422:
          res.on('end',function(){
            reject(_.merge({statusCode:res.statusCode},JSON.parse(data)))
          })
          break;
        case 500:
          reject({message:'Internal Server Error',statusCode:res.statusCode});
          break;
        case 503:
          reject({message:'Service Unavailable',statusCode:res.statusCode});
          break
      }
    });

    req.on('error', function(e){
      reject()
      //host not found
      //conn refused
    });

    return req;
  }

  function serialize(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
}
