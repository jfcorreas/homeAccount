'use strict';

describe('Service: mongoService', function () {

  var $http, $httpBackend, mongoService, collectionUrl;
  var collectionName = 'collectionTest';
  beforeEach(module('homeAccountApp'));
  /*beforeEach(inject(function(_DB_CONFIG_) {
    collectionUrl = _DB_CONFIG_.server + _DB_CONFIG_.baseUrl + 
                    _DB_CONFIG_.dbName +'/'+ collectionName;
  }));
  //beforeEach(module('test-with-http-backend'));
  beforeEach(inject(function(_$httpBackend_) {
    //$http = _$http_;
    $httpBackend = _$httpBackend_;
  }));*/

  beforeEach(module('mongodb'));
  beforeEach(inject(function (_mongoService_, _$http_, _$httpBackend_, _DB_CONFIG_) {
    mongoService = _mongoService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    collectionUrl = _DB_CONFIG_.server + _DB_CONFIG_.baseUrl + 
                    _DB_CONFIG_.dbName +'/'+ collectionName;    
  }));

  it('should return a Resource with a query function', function () {
    var Resource = mongoService(collectionName);
    expect(typeof Resource.query).toBe("function");
  });

  it('should find an object by id', function () {
    var objectId = 'id_12345';
    $httpBackend.whenGET(collectionUrl + '/' + objectId).respond({_id: objectId, name: 'test'});
    var Resource = mongoService(collectionName);
    Resource.find(objectId).success(function(object){
      expect(object._id).toBe(objectId);
      expect(object.name).toBe('test');
    });
    $httpBackend.flush();    
  });

  it('should query all objects of a collection', function () {
    $httpBackend.whenGET(collectionUrl + '?').respond([{name: 'Pawel'}, {name: 'Peter'}]);
    var Resource = mongoService(collectionName);
    Resource.query().success(function(results){
      expect(results.length).toEqual(2);
    });
    $httpBackend.flush();    
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});