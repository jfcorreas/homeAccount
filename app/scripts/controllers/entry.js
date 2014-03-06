'use strict';

var entryControllers = angular.module('entryControllers', ['mongodb']);

entryControllers.factory('Entries', function(mongoService) {
  return mongoService('entries');
});

entryControllers.controller('entriesCtrl', ['$scope', 'Entries', 
  function ($scope, Entries) {
    var _currentDate = new Date();
    _currentDate.setHours(0,0,0,0);

    $scope.workDate = _currentDate;
   
    Entries.query().then(function(entries) {
      $scope.entries = entries;
    });
}]);