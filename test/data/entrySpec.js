'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    mongoose = require('mongoose');

describe('Models: entry', function () {
  var Entry = require('../../data/models/entry');

  it('should exist', function () {
    should.exist(Entry);
  });

  it('should contain: concept, conceptType, amount, and date', function () {
    var oneEntry = { 
      concept: 'Ingreso de prueba',
      conceptType: 'I',
      amount: '300',
      entryDate: Date.now
    };

    Entry.create(oneEntry, function(err) {
      should.not.exist(err);      
    });

    oneEntry.conceptType = undefined;

    Entry.create(oneEntry, function(err) {
      should.exist(err);  
    });    
  });  
});