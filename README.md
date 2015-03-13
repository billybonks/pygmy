# Pygmy [![Code Climate](https://codeclimate.com/github/billybonks/pygmy/badges/gpa.svg)](https://codeclimate.com/github/billybonks/pygmy)  [![Travis-CI](https://travis-ci.org/billybonks/pygmy.svg)](https://travis-ci.org/billybonks/pygmy)

The semi official nodejs module (employee maintained)

##Introduction

This library provides a Nodejs interface to publicly available (beta) API for TradeGecko.

If you are unfamiliar with the TradeGecko API, you can read the documentation located at http://developer.tradegecko.com

##Installation

`npm i billybonks\pygmy -save`



##Basic Usage
```javascript
var pygmy = require('pygmy')({token:yourToken,cleintId:clientId,secret:secret})

pygmy.products.all().then(function(products){
  console.log(products)
},function(error){
  console.log(error)
})
```

##Finding Records

```javascript
pygmy.products.all()
pygmy.products.find(id)
pygmy.products.findMany(id_array)
pygmy.products.where(query_hash)
```

query hash will be converted into url encoded  query string


##Identity Map

in development

##Building Records
###Create
 `pygmy.products.build(attribute_hash)`

 Each key should map to an attribute defined in api documentation, invalid keys will result in an error from the server

 ```javascript
pygmy.companies.build({name:'Awesome',comapny_type:'business'}).save().then(function(result){
    console.log(result)
  },function(error){
    console.log(error)
  });
```

###Update
```javascript
pygmy.products.find(id).then(function(product){
    product.set('name','COOL NAME')
    product.save().then(function(product){
      console.log('awesome saved')
    })
})
```

###Delete
```javascript
pygmy.products.find(id).then(function(product){
    product.set('name','COOL NAME')
    product.delete().then(function(product){
      console.log('awesome deleted')
    })
})
```

##Errors
Errors always return in the format

`{message:message,statusCode:statusCode}`

nothing says it more then showing you the code that generates returns from http requests

```javascript
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
```

##TODO
* Basic Identity Mapping
* Relationship declerations (if needed for perf gains)
* Instrumentation
* OAuth
* Build Test suite
* Add All Routes

## Contributing

1. Fork it ( http://github.com/billybonks/pygmy/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

###Missing route?
 Just add `pygmy['addresses'] = routes.build(pygmy,'addresses');` where addresses is the endpoint name shown in api (they are always plural), to pygmy.js.
