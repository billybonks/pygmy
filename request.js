var _ = require('lodash');
var RSVP = require('rsvp');
var https = require('https');
var Buffer = require('buffer')
module.exports = function(token,id,secret,host){
  return {
    get:get,
    where:where,
    post:post,
    baseOptions:{
      host:'api.tradegecko.com',
      headers: {
        Authorization: 'Bearer '+ token
      }
    }
  }

  function where (route,params){
    route = route+'?'+serialize(params)
    return this.get({path:route});
  }

  function get (params){
    var _self = this;
    return new RSVP.Promise(function(resolve,reject){
      var req = createRequest(_.merge(_.merge({method: 'GET'},_self.baseOptions),params),resolve,reject)
      req.end();
      req.on('error', function(e){
        reject()
        //host not found
        //conn refused
      });
    });
  }
//Buffer.byteLength(data)
  function post(data,path){
    var _self = this;
    return new RSVP.Promise(function(resolve,reject){
      var headers ={method: 'POST',
                    path:path,
                    headers:{
                      'Content-Length':JSON.stringify(data).length,//Buffer.byteLength(data),
                      'Content-Type':'application/json'
                     }
                    }
      console.log(_.merge(headers,_self.baseOptions));
      var req = createRequest(_.merge(headers,_self.baseOptions),resolve,reject)
      req.write(JSON.stringify(data));
      req.end();
      console.log('end')
      req.on('error', function(e){
        //host not found
        //conn refused
        console.log(e)
      });
    });
  }

  function createRequest(params,resolve,reject){
    return https.request(params, function(res) {
      var error
      var data = '';
      console.log(res.statusCode)
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
          // Service Unavailable
          break
      }


    });
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
