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
 * @param {?Object} options
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

exports.Collection = Collection;