'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    request = require('supertest'), 
	config = require('../config');

var mongoose = require('mongoose'),
	entry = require('../models/entry');    

describe('Routing', function() {

	describe('Entry', function() {
		var firstDate = Date.now();
		var firstEntryId = null;
		var db = null;

		function generateTestEntry(concept, conceptType, amount, date) {
			
			var entryDate = date;
		  	if (entryDate == null) {
		  		currentDate = Date.now();
		  	}
		  
		  	var oneEntry = { 
		    	concept: concept,
		    	conceptType: conceptType,
		    	amount: amount,
		    	date: entryDate
		  	};

		  	return oneEntry;
		};

		before(function (done) {
		    db = mongoose.connect(config.dbtest.mongodb);
		    done(); 
		});

		beforeEach(function (done) {
		  	entry.create(generateTestEntry('Income test', 'I', 3000, firstDate),
		  	 function(err, doc) {
		  		if (err) { throw err; }
		    	firstEntryId = doc._id;
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
				.get('/entries/' + firstEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.should.have.property('_id');
					res.body.concept.should.equal('Income test');
					res.body.conceptType.should.equal('I');
					res.body.amount.should.equal(3000);
					new Date(res.body.date).should.deep.equal(new Date(firstDate));
					done();
				});
		});

		it('should get all entries', function(done) {
			var secondDate = Date.now();
			var secondEntryId = null;
		  	entry.create(generateTestEntry('Income test 2', 'I', 30, secondDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	secondEntryId = doc._id;
		  	});				
			request(config.apidb.url)
				.get('/entries/')
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.length.should.equal(2);
					res.body[0].should.have.property('_id');
					res.body[0].concept.should.equal('Income test');
					res.body[0].conceptType.should.equal('I');
					res.body[0].amount.should.equal(3000);
					new Date(res.body[0].date).should.deep.equal(new Date(firstDate));
					res.body[1].should.have.property('_id');
					res.body[1].concept.should.equal('Income test 2');
					res.body[1].conceptType.should.equal('I');
					res.body[1].amount.should.equal(30);
					new Date(res.body[1].date).should.deep.equal(new Date(secondDate));					
					done();
				});
		});		

		it('should save an entry', function(done) {
			var secondDate = Date.now();
			var newEntry = generateTestEntry('Income test 2', 'I', 30, secondDate);				

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
							new Date(res.body.date).should.deep.equal(new Date(secondDate));	
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
				.put('/entries/' + firstEntryId)
				.send(updatedEntry)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					res.body.entriesUpdated.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + firstEntryId)
						.end(function(err, res) {
							if (err) { throw err; }
							res.body.concept.should.equal('Income test Updated');
							res.body.conceptType.should.equal('I');
							res.body.amount.should.equal(301);
							new Date(res.body.date).should.deep.equal(new Date(firstDate));
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
				.put('/entries/' + firstEntryId)
				.send(updatedEntry)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(406);
					done();
			});
		});		

		it('should remove an entry by id', function(done) {
			request(config.apidb.url)
				.del('/entries/' + firstEntryId)
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + firstEntryId)
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