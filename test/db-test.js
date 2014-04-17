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

describe('Db', function(){

    it('should open', function(done) {
        var db = new mp.Db('mptestdb', new mp.Server('localhost', 27017), {w:1});
        db.open().then(function(db) {
            done();
        });

    });

    it('should fetch a collection', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
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
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
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

    it('should create a collection', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                assert.notEqual(db, null, 'db null');
                return db.createCollection('testcol');
            })
            .then(function(col) {
                assert.notEqual(col, null, 'col null');
                done();
            })
            .fail(function(err) {
                done(err);
            })

    });

    it('should drop itself', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                assert.notEqual(db, null, 'db null');
                return db.dropDatabase();
            })
            .then(function(result) {
                done();
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should get all db stats', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db){
                assert.notEqual(db, null, 'db null');
                return db.stats();
            })
            .then(function(stats) {
                assert.equal(stats.db, 'mptestdb', 'assert db name');
                done();
            })
            .fail(function(err) {
                done(err);
            })
    });

    it('should rename a collection', function(done) {
        mp.MongoClient.connect("mongodb://localhost:27017/mptestdb")
            .then(function(db) {
                assert.notEqual(db, null, 'db null');
                return db.createCollection('testcol')
                    .then(function (col1) {
                        return db.renameCollection('testcol', 'testcol2');
                    })
                    .then(function (col2) {
                        done();
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
                return db.createCollection('test_drop_col')
                    .then(function() {
                        return db.dropCollection('test_drop_col');
                    })
            })
            .then(function() {
                done();
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
            })
            .then(function() {
                done();
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
            })
            .then(function() {
                done();
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

                        return db.dropCollection('test_create_index_col');
                    })
            })
            .then(function() {
                done();
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
                        return db.dropCollection('test_create_index_col');
                    })
            })
            .then(function() {
                done();
            })
            .fail(function(err) {
                done(err);
            })

    });
});