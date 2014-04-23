mongodb-promise
---------------

[![Build Status](https://travis-ci.org/jbong/mongodb-promise.svg?branch=master)](https://travis-ci.org/jbong/mongodb-promise)

Mongodb-promise is a light promise wrapper around [node-mongodb-native](https://github.com/mongodb/node-mongodb-native).


## Quick Examples

```js
// Obtaining a connection
var mp = require('mongodb-promise');

mp.MongoClient.connect("mongodb://127.0.0.1:27017/test").then(function(db){
    db.close().then(console.log('success'));
}, function(err) {
    console.log(err);
});

// Read Db stats
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
.then(function(db){
    return db.stats().then(function(stats) {
        console.log(stats);
        db.close().then(console.log('success'));
    })
})
.fail(function(err) {console.log(err)});

// Insert documents
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
    .then(function(db){
        return db.collection('test')
            .then(function(col) {
                return col.insert([{a : 1}, {a : 2}])
                    .then(function(result) {
                        console.log(result);
                        db.close().then(console.log('success'));
                    })
            })
})
.fail(function(err) {console.log(err);});

// Read documents
mp.MongoClient.connect("mongodb://127.0.0.1:27017/test")
    .then(function(db){
        return db.collection('test')
            .then(function(col) {
                return col.find({a : 1})
                    .then(function(cursor){
                        return cursor.toArray();
                    })
                    .then(function(items) {
                        console.log(items);
                        db.close().then(console.log('success'));
                    })
        })
})
.fail(function(err) {console.log(err)});

```
## Download

## Test

    make test