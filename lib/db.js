var Q = require('q');
var MongoDB = require('mongodb');
var Collection = require('./collection').Collection;

/**
 * Create a new Db instance
 * @param databaseName
 * @param serverConfig
 * @param options
 * @constructor
 */
var Db = function(databaseName, serverConfig, options){
    this.databaseName = databaseName;
    this.serverConfig = serverConfig;
    this.options = options;
};

/**
 * Initialize the database connection
 * @returns {promise|*|Q.promise}
 */
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

/**
 *
 * @param collectionName
 * @param options
 * @returns {promise|*|Q.promise}
 */
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
/**
 *
 * @param {string} collectionName
 * @param {?Object} options
 * @returns {promise|*|Q.promise}
 */
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
/**
 * Close the current db connection
 * @param force
 * @returns {promise|*|Q.promise}
 */
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
/**
 * Creates a collection on a server
 * @param collectionName
 * @param options
 * @returns {promise|*|Q.promise}
 */
Db.prototype.createCollection = function(collectionName, options) {
    var deferred = Q.defer();
    var self = this;
    this._db.createCollection(collectionName, options || {}, function(err, collection) {
        if(err) {
            deferred.reject(err);
        } else {
            var mpCol = new Collection(self, collectionName);
            mpCol._col = collection;
            deferred.resolve(mpCol);
        }
    });
    return deferred.promise;
};
/**
 * Drop a database
 * @returns {promise|*|Q.promise}
 */
Db.prototype.dropDatabase = function() {
    var deferred = Q.defer();
    this._db.dropDatabase(function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Get all the db statistics
 * @returns {promise|*|Q.promise}
 */
Db.prototype.stats = function() {
    var deferred = Q.defer();
    this._db.stats(function(err, stats) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(stats);
        }
    });
    return deferred.promise;
};
/**
 * Rename a collection
 * @param {string} fromCollection
 * @param {string} toCollection
 * @param {?Object} options
 * @returns {promise|*|Q.promise}
 */
Db.prototype.renameCollection = function(fromCollection, toCollection, options) {
    var deferred = Q.defer();
    var self = this;
    this._db.renameCollection(fromCollection, toCollection, options || {}, function(err, collection) {
        if(err) {
            deferred.reject(err);
        } else {
            var mpCol = new Collection(self, toCollection);
            mpCol._col = collection;
            deferred.resolve(mpCol);
        }
    });
    return deferred.promise;
};

exports.Db = Db;