/**
 * Created by jbong on 14/04/2014.
 */

var mp = require('./mongodb-promise');

/*
mp.MongoClient.connect("mongodb://localhost:27017/test").then(function(db){
    db.close().then(function(result) {
        console.log(result);
    });
}, function(err) {
   console.log(err);
});*/

var db = new mp.Db('test', new mp.Server('localhost', 27017), {w :1});
// Establish connection to db
db.open().then(function(db) {
    //assert.equal(null, err);

    //db.on('close', test.done.bind(test));
    db.close();
}, function(err) {console.log('hello')});