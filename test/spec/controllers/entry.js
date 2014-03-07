'use strict';

describe('Controller: entriesCtrl', function () {

  // load the controller's module
  beforeEach(module('homeAccountApp'));

  var entriesCtrl,
    scope;

  // Initialize the controller, a mock scope and mock services
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    entriesCtrl = $controller('entriesCtrl', {
      $scope: scope
    });
  }));

  it('should initialize workDate', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    expect(scope.workDate).toEqual(currentDate);
  });

  it('should increment workDate', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    scope.workDate.setDate(currentDate.getDate() - 1);
    scope.incrementWorkDate();
    expect(scope.workDate).toEqual(currentDate);
  });

  it('shouldnt increment workDate if exceeds today date', function () {
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    scope.incrementWorkDate();
    expect(scope.workDate).toEqual(currentDate);
  });

});
