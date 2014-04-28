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


describe('mongodb-promise', function(){

    before(function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.dropDatabase()
                    .then(function() {
                        return db.close().then(done());
                    })
            })
            .fail(function(err) {
                done(err);
            })
    });

    afterEach(function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                return db.dropCollection('test').then(function() {done()}, function(err) {done()});
            })
    });

    describe('MongoClient', function(){
        it('should connect to mongodb via mongodb:// uri', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb").then(function(db){
                return db.close().then(done());
            }, function(err) {
                done(err);
            });
        });
    });

    describe('Db', function(){

        it('should open', function(done) {
            var db = new mp.Db('mptestdb', new mp.Server('localhost', 27017), {w:1});
            db.open().then(function(db) {
                return db.close().then(done());
            }, function(err) {done(err)});

        });

        it('should fetch a collection', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db) {
                    assert.notEqual(db, null, 'db null');
                    return db.collection('test')
                        .then(function (col) {
                            assert.notEqual(col, null, 'col null');
                            assert.equal(col._col.collectionName, 'test', 'assert col name');
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })
        });

        it('should fetch collection names', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.collectionNames()
                        .then(function(items) {
                            assert.notEqual(items, null, 'collectionNames null');
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })

        });

        it('should create a collection', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('testcol')
                        .then(function(col) {
                            assert.notEqual(col, null, 'col null');
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })

        });

        it('should get all db stats', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.stats()
                        .then(function(stats) {
                            assert.equal(stats.db, 'mptestdb', 'assert db name');
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })
        });

        it('should rename a collection', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db) {
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test')
                        .then(function (col1) {
                            return db.renameCollection('test', 'test2');
                        })
                        .then(function (col2) {
                            assert.ok(col2._col.collectionName == 'test2');
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })
        });

        it('should drop a collection', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test')
                        .then(function() {
                            return db.dropCollection('test');
                        })
                        .then(function() {
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })
        });

        it('should create an index', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test_create_index_col')
                        .then(function (col1) {
                            return db.createIndex('test_create_index_col', {unique:true});
                        })
                        .then(function() {
                            return db.dropCollection('test_create_index_col');
                        })
                        .then(function() {
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })

        });

        it('should ensure an index', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test_create_index_col')
                        .then(function (col1) {
                            return db.ensureIndex('test_create_index_col', {unique:true});
                        })
                        .then(function() {
                            return db.dropCollection('test_create_index_col');
                        })
                        .then(function() {
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })

        });

        it('should get all index information', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test_create_index_col')
                        .then(function (col1) {
                            return db.ensureIndex('test_create_index_col', {a :1}, {unique:true});
                        })
                        .then(function() {
                            return db.indexInformation('test_create_index_col');
                        })
                        .then(function(info) {
                            assert.ok(info != null);
                            assert.deepEqual([ [ '_id', 1 ] ], info._id_);
                            assert.deepEqual([ [ 'a', 1 ] ], info.a_1);
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })
        });

        it('should reindex a collection', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    assert.notEqual(db, null, 'db null');
                    return db.createCollection('test_create_index_col')
                        .then(function (col1) {
                            return db.ensureIndex('test_create_index_col', {a :1}, {unique:true});
                        })
                        .then(function(res) {
                            return db.reIndex('test_create_index_col');
                        })
                        .then(function() {
                            return db.close().then(done());
                        })
                })
                .fail(function(err) {
                    done(err);
                })

        });
    });


    describe('Collection', function() {
        it('should get stats', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    return db.createCollection('test')
                        .then(function(col) {
                            return col.stats();
                        })
                        .then(function(stats) {
                            assert.ok(stats.count == 0);
                            return db.close().then(done());
                        })
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                            return col.rename('test_renamed')
                                .then(function(col) {
                                    assert.equal(col._col.collectionName, 'test_renamed');
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return db.close().then(done());
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
                                    return col.find({a : 1}).toArray();
                                })
                                .then(function(items) {
                                    assert.ok(items.length == 2);
                                    return db.close().then(done());
                                })
                        })
                })
                .fail(function(err) {
                    done(err);
                }).done()
        });

        it('should find documents and return cursor', function(done) {
            mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
                .then(function(db){
                    return db.createCollection('test')
                        .then(function(col) {
                            return col.insert([{a : 1}, {a : 1}, {a : 2}])
                                .then(function() {
                                    var c = col.find({a : 1});
                                    assert.ok(c instanceof mp.Cursor);
                                    return db.close().then(done());
                                })
                        })
                })
                .fail(function(err) {
                    done(err);
                }).done()
        });

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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
                                })
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
                                    return db.close().then(done());
                                })
                        })
                })
                .fail(function(err) {
                    done(err);
                }).done()
        });
    });

});



