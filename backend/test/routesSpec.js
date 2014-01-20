'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    request = require('supertest'), 
	config = require('../config');

var mongoose = require('mongoose'),
	entry = require('../models/entry');    

describe('Routing', function() {

	describe('Entry', function() {
		var firstDate = new Date("2014/01/01");
		var secondDate, thirdDate, fourthDate;
		var firstEntryId = null;
		var secondEntryId, thirdEntryId, fourthEntryId;
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

		function generateSecondaryEntries() {
			secondDate = new Date("2014/2/7");
			secondEntryId = null;
		  	entry.create(generateTestEntry('Income test 2', 'I', 30, secondDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	secondEntryId = doc._id;
		  	});			
			thirdEntryId = null;
			thirdDate = new Date("2014/1/17");
		  	entry.create(generateTestEntry('Expense test 3', 'E', 50, thirdDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	thirdEntryId = doc._id;
		  	});
		  	fourthEntryId = null;
			fourthDate = new Date("2014/1/31");
		  	entry.create(generateTestEntry('Expense test 4', 'E', 150, fourthDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	fourthEntryId = doc._id;
		  	});		
		}

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
			generateSecondaryEntries();				
			request(config.apidb.url)
				.get('/entries/')
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.length.should.equal(4);
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

		it('should get entries filtered by date', function(done) {
  			generateSecondaryEntries();
			request(config.apidb.url)
				.get('/entries?inidate=2014/01/01&enddate=2014/01/31') 
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.length.should.equal(3);
					res.body[0].should.have.property('_id');
					res.body[0].concept.should.equal('Income test');
					res.body[0].conceptType.should.equal('I');
					res.body[0].amount.should.equal(3000);
					new Date(res.body[0].date).should.deep.equal(new Date(firstDate));
					res.body[1].should.have.property('_id');
					res.body[1].concept.should.equal('Expense test 3');
					res.body[1].conceptType.should.equal('E');
					res.body[1].amount.should.equal(50);
					new Date(res.body[1].date).should.deep.equal(new Date(thirdDate));	
					res.body[2].should.have.property('_id');
					res.body[2].concept.should.equal('Expense test 4');
					res.body[2].conceptType.should.equal('E');
					res.body[2].amount.should.equal(150);
					new Date(res.body[2].date).should.deep.equal(new Date(fourthDate));				
					done();
				});
		});

		it('should get entries filtered by conceptType', function(done) {
  			generateSecondaryEntries();
			request(config.apidb.url)
				.get('/entries?ctype=E&inidate=2014/01/01&enddate=2014/01/31') 
				.end(function(err, res) {
					if (err) { throw err; }
					res.status.should.equal(200);
					res.body.length.should.equal(2);
					res.body[0].should.have.property('_id');
					res.body[0].concept.should.equal('Expense test 3');
					res.body[0].conceptType.should.equal('E');
					res.body[0].amount.should.equal(50);
					new Date(res.body[0].date).should.deep.equal(new Date(thirdDate));
					res.body[1].should.have.property('_id');
					res.body[1].concept.should.equal('Expense test 4');
					res.body[1].conceptType.should.equal('E');
					res.body[1].amount.should.equal(150);
					new Date(res.body[1].date).should.deep.equal(new Date(fourthDate));				
					done();
				});
		});

		it('should get entries filtered by amount', function(done) {
  			generateSecondaryEntries();
			request(config.apidb.url)
				.get('/entries?iniamount=150&endamount=3000') 
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
					res.body[1].concept.should.equal('Expense test 4');
					res.body[1].conceptType.should.equal('E');
					res.body[1].amount.should.equal(150);
					new Date(res.body[1].date).should.deep.equal(new Date(fourthDate));				
					done();
				});
		});

		it('should save an entry', function(done) {
			var newDate = new Date("2014/10/27");
			var newEntry = generateTestEntry('Income test 2', 'I', 30, newDate);				

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
							new Date(res.body.date).should.deep.equal(new Date(newDate));	
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