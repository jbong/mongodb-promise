mongodb-promise
---------------

[![Build Status](https://travis-ci.org/jbong/mongodb-promise.svg?branch=master)](https://travis-ci.org/jbong/mongodb-promise)

Mongodb-promise is a light promise wrapper around [node-mongodb-native](https://github.com/mongodb/node-mongodb-native).


## Quick Examples

```js
// Obtaining a connection
var mp = require('mongodb-promise');

mp.MongoClient.connect("mongodb://127.0.0.1:27017/test").then(function(db){
    // db connected
    db.close().then(console.log('success'));
}, function(err) {
    // oops
    console.log(err);
});

```
## Download

## Test

    make test