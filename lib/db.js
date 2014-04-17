var Q = require('q');
var MongoDB = require('mongodb');
var Collection = require('./collection').Collection;

var Db = function(databaseName, serverConfig, options){
    this.databaseName = databaseName;
    this.serverConfig = serverConfig;
    this.options = options;
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

exports.Db = Db;