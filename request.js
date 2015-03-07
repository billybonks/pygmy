var _ = require('lodash');
var RSVP = require('rsvp')
var https = require('https')

exports.get = get


function get (params){
  return new RSVP.Promise(function(resolve,reject){

    var options = {
      host: 'api.tradegecko.com',
      method: 'GET',
      headers: {
        Authorization: 'Bearer 04da3096ef04ee6c64304985797c8a7dada0be6f13cfac630384402eb865dbd4'
      }
    };

    var req = https.request(_.merge(options,params), function(res) {
      switch(res.statusCode){
        case 200:
          res.on('data', function(d) {
            process.stdout.write(d);
          });
          break;
        case 401:
          //unauthed
          break;
        case 500:
          //internal server error
          break;
      }

    });

    req.end();
    req.on('error', function(e){
      //host not found
      //conn refused
      console.log('error')
      console.error(e);
    });
  });
}
