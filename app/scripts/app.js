'use strict';

var homeAccountApp = angular.module('homeAccountApp', 
  ['ngRoute', 'ngQuickDate', 'entryControllers']);

homeAccountApp.config(['$routeProvider', 
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/entries.html',
        controller: 'entriesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

homeAccountApp.config(function(ngQuickDateDefaultsProvider) {
  // Configure with icons from font-awesome
  return ngQuickDateDefaultsProvider.set({
    closeButtonHtml: "<i class='fa fa-times'></i>",
    buttonIconHtml: "<i class='fa fa-calendar'></i>",
    nextLinkHtml: "<i class='fa fa-chevron-right'></i>",
    prevLinkHtml: "<i class='fa fa-chevron-left'></i>",
    /* Take advantage of Sugar.js date parsing
    parseDateFunction: function(str) {
      d = Date.create(str);
      return d.isValid() ? d : null;
    }*/
  });
});

homeAccountApp.constant('DB_CONFIG', {
  server: 'http://127.0.0.1:3000',
  baseUrl: '/',
  dbName: 'apidb'
});
