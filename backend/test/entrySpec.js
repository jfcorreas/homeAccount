'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    config = require('../config');

var mongoose = require('mongoose'),
    entry = require('../models/entry');

describe('Models', function () {

  describe('Entry', function () {

    var currentEntry = null;
    var currentDate = null;
    var db = null;

    before(function (done) {
      db = mongoose.connect(config.dbtest.mongodb);
      done(); 
    });

    beforeEach(function (done) {
      currentDate = Date.now();
      var oneEntry = { 
        concept: 'Income test',
        conceptType: 'I',
        amount: '3000',
        date: currentDate
      };
      entry.create(oneEntry, function(err, doc) {
        if (err) { throw err; }
        currentEntry = doc;
        done();
      });
    });

    afterEach(function(done) {
      entry.remove({}, function() {
        done();
      });
    });

    it('should exist', function () {
      should.exist(currentEntry);
    });

    it('should contain: concept, conceptType, amount, and date', function (done) {
      entry.findOne({concept: 'Income test'})
        .exec(function(err, doc) {
          expect(doc.concept).to.equal('Income test');
          expect(doc.conceptType).to.equal('I');
          expect(doc.amount).to.equal(3000);
          expect(doc.date).to.deep.equal(new Date(currentDate));
          done();
        });
    });

    it('should contain a valid Concept Type', function (done) {

      var badEntry = { 
        concept: 'Bad Concept Type',
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
});