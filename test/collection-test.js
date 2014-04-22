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
                        return col.save({a : 1})
                            .then(function(doc) {
                                assert(doc != null);
                                assert.ok(doc.a == 1);
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

    it('should update a document', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.save({a : 1})
                            .then(function() {
                                return col.update({a : 1}, {$set:{b:2}});
                            })
                            .then(function(result) {
                                assert.equal(result, 1);
                                return db.dropCollection('test');
                            })
                            .then(done())
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should fetch distinct values for a key', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function(result) {
                                assert.equal(result.length, 3);
                                return col.distinct('a');
                            })
                            .then(function(result) {
                                assert.deepEqual([1, 2], result.sort());
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should count', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function(result) {
                                assert.equal(result.length, 3);
                                return col.count();
                            })
                            .then(function(result) {
                                assert.equal(result, 3);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });


    it('should drop itself', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.drop()
                            .then(function(result) {
                                return db.collectionNames('test')
                            })
                            .then(function(names) {
                                assert.equal(0, names.length);
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should find and modify a document', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.findAndModify({a : 2}, [['a', 1]], {$set : {b :2}}, {new:true})
                            })
                            .then(function(doc) {
                                assert.ok(doc != null);
                                assert.equal(doc.b, 2);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should find one document', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function() {
                                return col.findOne({a : 2})
                            })
                            .then(function(doc) {
                                assert.ok(doc != null);
                                assert.equal(doc.a, 2);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should find and remove a document', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.findAndRemove({a : 2}, [['a', 1]])
                            })
                            .then(function(){
                                return col.findOne({a : 2});
                            })
                            .then(function(doc) {
                                assert.ok(doc == null);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should find documents and return array', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function(result) {
                                return col.find({a : 1})
                            })
                            .then(function(cursor){
                                return cursor.toArray();
                            })
                            .then(function(items) {
                                assert.ok(items.length == 2);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

    it('should find documents and return cursor', function(done) {
        var found = [];

        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.createCollection('test')
                    .then(function(col) {
                        return col.insert([{a : 1}, {a : 1}, {a : 2}])
                            .then(function() {
                                return col.find({a : 1})
                            })
                            .then(function(cursor){
                                return cursor.each(function(doc) {
                                   found.push(doc);
                                });
                            })
                            .then(function() {
                                assert.ok(found.length == 2);
                                return db.dropCollection('test');
                            })
                            .then(function() {
                                done();
                            })
                    })
            })
            .fail(function(err) {
                done(err);
            }).done()
    });

});