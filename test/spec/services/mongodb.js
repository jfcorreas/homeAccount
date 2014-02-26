'use strict';

describe('Service: mongoService', function () {

  var $http, $httpBackend, mongoService, collectionUrl, Resource;
  var collectionName = 'collectionTest';
  beforeEach(module('homeAccountApp'));
  beforeEach(module('mongodb'));
  beforeEach(inject(function (_mongoService_, _$http_, _$httpBackend_, _DB_CONFIG_) {
    mongoService = _mongoService_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    collectionUrl = _DB_CONFIG_.server + _DB_CONFIG_.baseUrl + 
                    _DB_CONFIG_.dbName +'/'+ collectionName; 
    Resource = mongoService(collectionName);   
  }));

  it('should return a Resource with a query function', function () {
    expect(typeof Resource.query).toBe("function");
  });

  it('should find an object by id', function () {
    var objectId = 'id_12345';
    $httpBackend.whenGET(collectionUrl + '/' + objectId).respond(200, {_id: objectId, name: 'test'});

    Resource.find(objectId).success(function(object){
      expect(object._id).toBe(objectId);
      expect(object.name).toBe('test');
    });
    $httpBackend.flush();    
  });

  it('should query objects of a collection', function () {
    $httpBackend.whenGET(collectionUrl + '?').respond(200, [{name: 'Test'}, {name: 'Test2'}]);

    Resource.query().success(function(results){
      expect(results.length).toEqual(2);
    });
    $httpBackend.flush();    
  });

  it('should query filtered objects of a collection', function () {
    var params = {query: {name:'Test'},
                  limitDate: {field:'date',start:'2014/01/01',end:'2014/01/31'},
                  limitNumber: {field:'amount', start:100, end:3000}};

    $httpBackend.whenGET(collectionUrl + '?' + 
      'limitDate=' + encodeURI(JSON.stringify(params.limitDate)).replace(/\//g,'%2F') +
      '&limitNumber=' + encodeURI(JSON.stringify(params.limitNumber)) +
      '&query=' + encodeURI(JSON.stringify(params.query)))
      .respond(200, [{name: 'Test'}, {name: 'Test2'}]);

    Resource.query(params).success(function(results){
      expect(results.length).toEqual(2);
    });
    $httpBackend.flush();    
  });  

  it('should save an object in a collection', function () {
    var object = {name: 'Test', surname: 'save'};

    $httpBackend.whenPOST(collectionUrl, object)
      .respond(200, {ok: 1, objectId:'test12345'});

    Resource.save(object).success(function(result){
      expect(result.ok).toEqual(1);
      expect(result.objectId).toEqual('test12345');
    });
    $httpBackend.flush();    
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});