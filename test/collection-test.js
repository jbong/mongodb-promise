var mp = require('../lib');
var assert = require('assert');
var Q = require('q');


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


    it('should insert documents', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.stats();
                            })
                            .then(function(stats) {
                                assert.ok(stats.count == 2);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })

                })

            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should remove selected documents', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.stats();
                            })
                            .then(function(stats) {
                                assert.ok(stats.count == 2);
                                return col.remove({a : 1});
                            })
                            .then(function(result) {
                                return col.stats();
                            })
                            .then(function(stats) {
                                assert.ok(stats.count == 1);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should remove all documents', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.stats();
                            })
                            .then(function(stats) {
                                assert.ok(stats.count == 2);
                                return col.remove();
                            })
                            .then(function(result) {
                                return col.stats();
                            })
                            .then(function(stats) {
                                assert.ok(stats.count == 0);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should rename itself', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db) {
                return db.createCollection('test')
                    .then(function(col) {
                        return col.save({hello: 'mongo'})
                            .then(function(result) {
                                return col.stats();
                            })
                    })
                    .then(function(stats) {
                        assert.ok(stats.count == 1);
                        return db.dropCollection('test');
                    })
                    .then(function() {
                        done();
                    })
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should save a document', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.rename('test2')
                            .then(function(result) {
                                return db.collectionNames('test2');
                            })
                            .then(function(names) {
                                assert.equal(1, names.length, 'renamed collection not found');
                                return db.dropCollection('test2');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            })
    });
});