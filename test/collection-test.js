var mp = require('../lib');
var assert = require('assert');


before(function(done) {
    mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
        .then(function(db){
            return db.dropDatabase();
        })
        .then(function() {
            done();
        })
        .fail(function(err) {
            done(err);
        })
});


describe('Collection', function() {

    it('should get stats', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test');
            })
            .then(function(col) {
                return col.stats();
            })
            .then(function(stats) {
                assert.ok(stats.count == 0);
                done();
            })
            .fail(function(err) {
                done(err);
            })
    });

});