'use strict';

describe('Controller: entriesCtrl', function () {

  var entriesCtrl, $scope, $timeout;
  var entriesServiceMock;

  beforeEach(function() {
    entriesServiceMock = jasmine.createSpyObj('Entries', ['query']);
    module('homeAccountApp');

    inject(function ($controller, $rootScope, $q, _$timeout_) {
      $scope = $rootScope.$new();
      entriesServiceMock.query.andReturn($q.when([{name: 'test'}]));
      $timeout = _$timeout_;
      entriesCtrl = $controller('entriesCtrl', {
        $scope: $scope,
        Entries: entriesServiceMock
      });
    });
  });

  it('should initialize workDate', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    expect($scope.workDate).toEqual(currentDate);
  });

  it('should increment workDate', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    $scope.workDate.setDate(currentDate.getDate() - 1);
    $scope.incrementWorkDate();
    expect($scope.workDate).toEqual(currentDate);
  });

  it('should not increment workDate if exceeds today\'s date', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    $scope.incrementWorkDate();
    expect($scope.workDate).toEqual(currentDate);
  });

  it('should initialize workEntry', function () {
    expect($scope.workEntry.concept).toEqual('');
    expect($scope.workEntry.conceptType).toEqual('E');
    expect($scope.workEntry.amount).toEqual(0);
  });

  it('should initialize entries', function () {
    expect(entriesServiceMock.query).toHaveBeenCalled();
    expect($scope.entries).toBe(undefined);
    $timeout.flush();
    expect($scope.entries instanceof Array).toBe(true);
  });

  it('should load entries of workDate\'s Month', function () {
    $scope.workDate = new Date('2014/02/14');
    $scope.loadEntries();

    var params = {limitDate: {field:'date',start:'2014/02/01', end:'2014/02/28'}};
    expect(entriesServiceMock.query).toHaveBeenCalledWith(params);

    $timeout.flush();
    expect($scope.entries instanceof Array).toBe(true);
  });  
});