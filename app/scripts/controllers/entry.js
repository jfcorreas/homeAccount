'use strict';

var entryControllers = angular.module('entryControllers', ['mongodb']);

entryControllers.factory('Entries', function(mongoService) {
  return mongoService('entries');
});

entryControllers.controller('entriesCtrl', ['$scope', 'Entries', 
  function ($scope, Entries) {
    var _currentDate = new Date();
    _currentDate.setHours(0,0,0,0);

    $scope.workDate = new Date(_currentDate);

    $scope.workEntry = {
      concept: '',
      conceptType: 'E',
      amount: 0
    };

    $scope.incrementWorkDate = function() {
      _currentDate = new Date();
      _currentDate.setHours(0,0,0,0);      
      if ($scope.workDate < _currentDate){
        $scope.workDate.setDate($scope.workDate.getDate() + 1);
      }
    };
   
    Entries.query().then(function(entries) {
      $scope.entries = entries;
    });
}]);

