'use strict';

var registerControllers = angular.module('registerControllers', ['mongodb']);

registerControllers.factory('Entries', function(mongoService) {
  return mongoService('entries');
});

registerControllers.controller('entriesCtrl', ['$scope', 'Entries', 
  function ($scope, Entries) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
   
    Entries.query().then(function(entries) {
      $scope.entries = entries;
    });
}]);