'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    config = require('../config');

var mongoose = require('mongoose'),
    entry = require('../models/entry');

entry.on('error', function(err) {
  console.log(err);
});

var db = mongoose.connect(config.dbtest.mongodb);    

describe('Models: entry', function () {

  var currentEntry = null;
  var currentDate = null;

  beforeEach(function (done) {
    currentDate = Date.now();
    var oneEntry = { 
      concept: 'Income test',
      conceptType: 'I',
      amount: '3000',
      date: currentDate
    };
    entry.create(oneEntry, function(err, doc) {
      currentEntry = doc;
      done();
    });
  });

  afterEach(function(done) {
    entry.remove({}, function() {
      done();
    });
  });

  it('should exist', function (done) {
    should.exist(currentEntry);
    entry.findOne({concept: 'Income test'})
      .exec(function(err, doc) {
        expect(doc.concept).to.equal('Income test');
        expect(doc.date).to.deep.equal(new Date(currentDate));
        done();
      });
  });

  it('should contain: concept, conceptType, amount, and date', function (done) {

    var badEntry = { 
      concept: 'Ingreso erroneo',
      conceptType: 'O',
      amount: '3000',
      date: Date.now()
    };

    entry.create(badEntry, function(err) {
      should.exist(err);  
      done();
    });    
  });  

  after(function () {
    db.connection.close();
  }); 
    
});