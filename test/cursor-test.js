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


describe('Cursor', function() {

    it('should determine how many results will be returned by the query ', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function() {
                                return col.find({a : 1}).count()
                            })
                            .then(function(result) {
                                assert.ok(result == 2);
                                return db.dropCollection('test');
                            })
                            .then(done());
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });


    it('should set an ascending sort criteria', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}, {a : 3}])
                            .then(function() {
                                return col.find().sort([['a',1]]).toArray()
                            })
                            .then(function(items) {
                                assert.ok(items[0].a == 1);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should set a descending sort criteria', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}, {a : 3}])
                            .then(function() {
                                return col.find().sort([['a',-1]]).toArray()
                            })
                            .then(function(items) {
                                assert.ok(items[0].a == 3);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should limit results', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}, {a : 3}])
                            .then(function() {
                                return col.find().limit(2).toArray();
                            })
                            .then(function(items) {
                                assert.ok(items.length == 2);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });


    it('should fetch the next object', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}, {a : 3}])
                            .then(function() {
                                return col.find().sort([['a',1]]).nextObject();
                            })
                            .then(function(doc) {
                                assert.ok(doc.a == 1);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });


    it('should fetch each object', function(done) {

        var found = [];

        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 2}, {a : 3}])
                            .then(function() {
                                return col.find().each(function(doc) {
                                    found.push(doc);
                                })
                            })
                            .then(function() {
                                assert.ok(found.length == 3);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });
});