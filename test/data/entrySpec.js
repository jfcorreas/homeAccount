'use strict';

var expect = require('chai').expect,
    should = require('chai').should();

var dbURL = 'mongodb://localhost:27017/homeAccTest',
    db = {};

describe('Models: entry', function () {

  before(function () {
    db = require('mongoose').connect(dbURL);
  });

  var Entry = require('../../app/models/entry');
  var oneEntry = { 
    concept: 'Income test',
    conceptType: 'I',
    amount: '300',
    date: Date.now()
  };

  it('should exist', function () {
    should.exist(Entry);
  });

  it('should contain: concept, conceptType, amount, and date', function () {
    Entry.create(oneEntry, function(err) {
      should.not.exist(err);      
    });

    var badEntry = { 
      concept: 'Ingreso erroneo',
      conceptType: 'O',
      amount: '3000',
      date: Date.now()
    };

    Entry.create(badEntry, function(err) {
      should.exist(err);  
    });    
  });  

  describe('Entry\'s Persistence', function () {

    it('should be stored in database', function () {

      Entry.find({concept: 'Income test'})
        .exec(function (err, result) {
          should.not.exist(err);
          should.exist(result);
          expect(result).to.have.length(1);
      });

      Entry.remove(oneEntry, function(err) {
        if (err) { return console.log(err); }
      });

    });
  });

  after(function () {
    db.connection.close();
  });   
});