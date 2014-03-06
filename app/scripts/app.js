'use strict';

var homeAccountApp = angular.module('homeAccountApp', ['ngRoute', 'entryControllers']);

homeAccountApp.config(['$routeProvider', 
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'entriesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

homeAccountApp.constant('DB_CONFIG', {
  server: 'http://127.0.0.1:3000',
  baseUrl: '/',
  dbName: 'apidb'
});
