/**
 * Created by jbong on 14/04/2014.
 */

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


describe('Db', function(){

    it('should open', function(done) {
        var db = new mp.Db('test', new mp.Server('localhost', 27017), {w:1});
        db.open().then(function(db) {
            done();
        });

    });

    it('should fetch a collection', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/test")
            .then(function(db){
                assert.notEqual(db, null, 'db null');
                return db.collection('test');
            })
            .then(function(col) {
                assert.notEqual(col, null, 'col null');
                assert.equal(col._col.collectionName, 'test', 'assert col name');
                done();
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should fetch collection names', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/test")
            .then(function(db){
                assert.notEqual(db, null, 'db null');
                return db.collectionNames();
            })
            .then(function(items) {
                assert.notEqual(items, null, 'collectionNames null');
                done();
            })
            .fail(function(err) {
                done(err);
            })

    });
});