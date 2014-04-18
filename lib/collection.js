var Q = require('q');

/**
 * Create a new Collection instance (INTERNAL TYPE, do not instantiate directly)
 * @param db
 * @param collectionName
 * @constructor
 */
var Collection = function(db, collectionName){
    this.db = db;
    this.collectionName = collectionName;
};

/**
 * Get all the collection statistics
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.stats = function(options) {
    var deferred = Q.defer();
    this._col.stats(options || {}, function(err, stats) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(stats);
        }
    });
    return deferred.promise;
};
/**
 * Inserts a single document or a an array of documents into MongoDB
 * @param {(Object|Object[])} docs
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.insert = function(docs, options) {
    var deferred = Q.defer();
    this._col.insert(docs, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Removes documents specified by selector
 * @param {Object} [selector]
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.remove = function(selector, options) {
    var deferred = Q.defer();
    this._col.remove(selector, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
Collection.prototype.delete = Collection.prototype.remove;
/**
 * Renames the collection
 * @param {string} newName
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.rename = function(newName, options) {
    var deferred = Q.defer();
    this._col.rename(newName, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
/**
 * Save a document
 * @param {Object} doc
 * @param {Object} [options]
 * @returns {promise|*|Q.promise}
 */
Collection.prototype.save = function(doc, options) {
    var deferred = Q.defer();
    this._col.save(doc, options || {}, function(err, result) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

exports.Collection = Collection;