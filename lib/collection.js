var Q = require('q');

var Collection = function(db, collectionName){
    this.db = db;
    this.collectionName = collectionName;
};

exports.Collection = Collection;