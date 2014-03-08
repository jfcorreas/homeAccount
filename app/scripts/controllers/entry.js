'use strict';

var entryControllers = angular.module('entryControllers', ['mongodb']);

var getWorkDateMonthParams = function (workDate) {
  var monthStartDate = workDate.getFullYear() + '/' +
     (workDate.getMonth()+1 < 10 ? '0' : '') + (workDate.getMonth()+1) + '/01';

  var monthEndDate = workDate.getFullYear() + '/' +
     (workDate.getMonth()+1 < 10 ? '0' : '') + (workDate.getMonth()+1) + '/' +
     new Date(workDate.getFullYear(), workDate.getMonth()+1, 0).getDate();  
       
  return {limitDate: {field:'date',start:monthStartDate, end:monthEndDate}};
};

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
    
    $scope.loadEntries = function (){
      Entries.query(getWorkDateMonthParams($scope.workDate))
      .then(function(entries) {
        $scope.entries = entries;
      });
    };

    $scope.loadEntries();
}]);

