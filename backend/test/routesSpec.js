'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    request = require('supertest'), 
	config = require('../config');

var mongoose = require('mongoose'),
	entry = require('../models/entry');    

describe('Routing', function() {

	describe('Entry', function() {
		var currentEntry = null;
		var currentDate = null;
		var currentEntryId = null;
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
		    currentEntryId = doc._id;
		    done();
		  });
		});	

		afterEach(function(done) {
		  entry.remove({}, function() {
		    done();
		  });
		});		

		it('should find an income by id', function(done) {
			request(config.apidb.url)
				.get('/entries/' + currentEntryId)
//				.send(currentEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.should.have.property('_id');
					res.body.concept.should.equal('Income test');
					res.body.conceptType.should.equal('I');
					res.body.amount.should.equal(3000);
					new Date(res.body.date).should.deep.equal(new Date(currentDate));
					done();
				});
		});

		it('should remove an income by id', function(done) {
			request(config.apidb.url)
				.del('/entries/' + currentEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					done();
				});
			request(config.apidb.url)
				.get('/entries/' + currentEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(404);
				});				
		});

		after(function () {
    		db.connection.close();
  		}); 
		
	});
});