'use strict';

describe('Service: mongoService', function () {

  var mongoService, DB_CONFIG;
  beforeEach(module('homeAccountApp'));
  beforeEach(module('mongodb'));

  beforeEach(inject(function (_mongoService_) {
    mongoService = _mongoService_;
  }));

  it('should return a Resource with a query function', function () {
    var Resource = mongoService('collection');
    expect(typeof Resource.query).toBe("function");
  });

});