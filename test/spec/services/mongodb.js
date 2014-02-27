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
      expect(results instanceof Array).toBe(true);
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
      expect(results instanceof Array).toBe(true);
      expect(results.length).toEqual(2);
    });
    $httpBackend.flush();    
  });  

  it('should save an object in a collection', function () {
    var object = {name: 'Test', surname: 'save'};
    var objectId = 'id_12345';

    $httpBackend.whenPOST(collectionUrl, object)
      .respond(200, {ok: 1, objectId: objectId});

    Resource.save(object).success(function(result){
      expect(result.ok).toEqual(1);
      expect(result.objectId).toEqual(objectId);
    });
    $httpBackend.flush();    
  });

  it('should fail saving a duplicated object in a collection', function () {
    var object = {name: 'Test', surname: 'duplicated'};

    $httpBackend.whenPOST(collectionUrl, object)
      .respond(500, {error: 'Duplicated Document'});

    Resource.save(object).success(function(result){
      expect(result.error).toEqual('Duplicated Document');
    });
    $httpBackend.flush();    
  });

  it('should update an object in a collection', function () {
    var objectId = 'id_12345';
    var object = {name: 'Test', surname: 'update', _id: objectId};

    $httpBackend.whenPUT(collectionUrl + '/' + object._id, object)
      .respond(200, {ok: 1, documentsUpdated: 1});

    Resource.update(object).success(function(result){
      expect(result.ok).toEqual(1);
      expect(result.documentsUpdated).toEqual(1);
    });
    $httpBackend.flush();    
  });

  it('should delete an object in a collection', function () {
    var objectId = 'id_12345';
    var object = {name: 'Test', surname: 'delete', _id: objectId};

    $httpBackend.whenDELETE(collectionUrl + '/' + object._id)
      .respond(200, {ok: 1});

    Resource.delete(object).success(function(result){
      expect(result.ok).toEqual(1);
    });
    $httpBackend.flush();    
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});