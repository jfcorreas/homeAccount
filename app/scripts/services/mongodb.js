'use strict';

var mongodb = angular.module('mongodb', []);

mongodb.factory('mongoService', function($http, $log, DB_CONFIG) {
  return function (collectionName) {

    var collectionUrl = DB_CONFIG.server + DB_CONFIG.baseUrl + 
                        DB_CONFIG.dbName +'/'+ collectionName;

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.find = function(objectId) {
      return $http.get(collectionUrl+'/'+objectId)
        .success(function(response) {
          return new Resource(response.data);
        })
        .error(function (error) {
          return {error: 'Find Error: ' + error};
        });
    };

    Resource.query = function(params) {
      return $http.get(collectionUrl, {
          params: (params || {})
        })
        .success(function(response) {
          var result = [];
          angular.forEach(response.data, function(value, key){
            result[key] = new Resource(value);
          });
          return result;
        })
        .error(function (error) {
          return {error: 'Query Error: ' + error};
        });
    };

    return Resource;
  };
});