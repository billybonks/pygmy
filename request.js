var _ = require('lodash');
var RSVP = require('rsvp');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
module.exports = function(token,id,secret){
  return {
    get:get
  }

  function get (params){
    return new RSVP.Promise(function(resolve,reject){
      console.log('route')
      var options = {
        host: 'api.tradegecko.com',
        method: 'GET',
        headers: {
          Authorization: 'Bearer '+ token
        }
      };

      var req = https.request(_.merge(options,params), function(res) {
        switch(res.statusCode){
          case 200:
            var data = '';
            res.on('data', function(chunk) {
              data += chunk;
            });
            res.on('end',function(){
              resolve(JSON.parse(data));
            })
            break;
          case 401:
            reject()//unauthed
            break;
          case 500:
            reject()//internal server error
            break;
        }

      });

      req.end();
      req.on('error', function(e){
        reject()
        //host not found
        //conn refused
      });
    });
  }
}
