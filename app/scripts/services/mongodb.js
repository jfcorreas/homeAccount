'use strict';

var mongodb = angular.module('mongodb', []);

mongodb.factory('mongoService', function($http, $log, DB_CONFIG) {
  return function (collectionName) {

    var collectionUrl = DB_CONFIG.server + DB_CONFIG.baseUrl + 
                        DB_CONFIG.dbName +'/'+ collectionName;

    var defaultParams = {};
    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.query = function(params) {
      return $http.get(collectionUrl, {
        //params: angular.extend({q:JSON.stringify({} || params)}, defaultParams)
        params: defaultParams
      }).then(function(response) {
          var result = [];
          angular.forEach(response.data, function(value, key){
            result[key] = new Resource(value);
          });
          return result;
      }, function (error) {
          return {error: 'Error en query'};
      });
    };

    return Resource;
  };
});