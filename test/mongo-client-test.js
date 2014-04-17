var mp = require('../lib');
var assert = require('assert');

describe('MongoClient', function(){

    it('should connect to mongodb via mongodb:// uri', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/test").then(function(db){
            done();
        }, function(err) {
            done(err);
        });
    });
});