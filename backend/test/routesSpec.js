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
		    amount: 3000,
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

		it('should find an entry by id', function(done) {
			request(config.apidb.url)
				.get('/entries/' + currentEntryId)
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

		it('should save an entry', function(done) {
			var newEntry = { 
			    concept: 'Income test 2',
			    conceptType: 'I',
			    amount: 30,
			    date: currentDate
			};
			request(config.apidb.url)
				.post('/entries')
				.send(newEntry)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					res.body.should.have.property('entryId');
					request(config.apidb.url)
						.get('/entries/' + res.body.entryId)
						.end(function(err, res) {
							if (err) { throw err; }
							res.status.should.equal(200);
							res.body.concept.should.equal('Income test 2');
							res.body.conceptType.should.equal('I');
							res.body.amount.should.equal(30);
							new Date(res.body.date).should.deep.equal(new Date(currentDate));	
							done();						
					});	
				});
		});

		it('should update an entry', function(done) {
			var updatedEntry = { 
			    concept: 'Income test Updated',
			    amount: 301
			};			

			request(config.apidb.url)
				.put('/entries/' + currentEntryId)
				.send(updatedEntry)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					res.body.entriesUpdated.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + currentEntryId)
						.end(function(err, res) {
							if (err) { throw err; }
							res.body.concept.should.equal('Income test Updated');
							res.body.conceptType.should.equal('I');
							res.body.amount.should.equal(301);
							new Date(res.body.date).should.deep.equal(new Date(currentDate));
							done();
					});						
			});
		});

		it('should fail updating a bad property in an entry', function(done) {
			var updatedEntry = {
		    	conceptType: 'BAD',
		    	amount: 301
			};			
			request(config.apidb.url)
				.put('/entries/' + currentEntryId)
				.send(updatedEntry)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(406);
					done();
			});
		});		

		it('should remove an entry by id', function(done) {
			request(config.apidb.url)
				.del('/entries/' + currentEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + currentEntryId)
						.end(function(err, res) {
							if (err) { throw err; }
							res.status.should.equal(404);
							done();
					});	
				});			
		});

		after(function () {
    		db.connection.close();
  		}); 
		
	});
});