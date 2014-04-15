/**
 * Created by jbong on 14/04/2014.
 */

var Q = require('q');
var MongoDB = require('mongodb');

var MongoClient = function() {};

var Db = function(databaseName, serverConfig, options){
    this.databaseName = databaseName;
    this.serverConfig = serverConfig;
    this.options = options;
};

var Collection = function(db, collectionName){
    this.db = db;
    this.collectionName = collectionName;
};


Db.prototype.open = function() {
    var _db = new MongoDB.Db(this.databaseName, this.serverConfig, this.options);

    var deferred = Q.defer();
    var self = this;

    _db.open(function(err, db) {
       if(err) {
           deferred.reject(err);
       } else {
           self._db = db;
           deferred.resolve(self);
       }
    });

    return deferred.promise;
};

Db.prototype.collection = function(collectionName, options) {
    var deferred = Q.defer();
    var self = this;

    this._db.collection(collectionName, options, function(err, col) {
        if(err) {
            deferred.reject(err);
        } else {
            var mpCol = new Collection(self, collectionName);
            mpCol._col = col;
            deferred.resolve(mpCol);
        }
    });
    return deferred.promise;
};

Db.prototype.collectionNames = function(collectionName, options) {
    var deferred = Q.defer();
    this._db.collectionNames(collectionName, options, function(err, items) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(items);
        }
    });
    return deferred.promise;
};

Db.prototype.close = function(force) {
    var deferred = Q.defer();

    this._db.close(force || false, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

MongoClient.connect = function(uri, opt) {
    var deferred = Q.defer();

    MongoDB.MongoClient.connect(uri, opt, function(err, db) {
        if(err) {
            deferred.reject(err);
        } else {
            var mpDb = new Db();
            mpDb._db = db;
            deferred.resolve(mpDb);
        }
    });

    return deferred.promise;
};

/**
 * wrapped objects
 */
exports.MongoClient = MongoClient;
exports.Db =  Db;

/**
 * objects where wrapping is not necessary
 */
exports.ReplSetServers = MongoDB.ReplSetServers;
exports.Server = MongoDB.Server;


