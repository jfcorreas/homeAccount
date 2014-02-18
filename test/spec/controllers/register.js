'use strict';

describe('Controller: entriesCtrl', function () {

  // load the controller's module
  beforeEach(module('homeAccountApp'));

  var entriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    entriesCtrl = $controller('entriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });

});
