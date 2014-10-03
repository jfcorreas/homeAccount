'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    request = require('supertest'), 
	config = require('../config');

var mongoose = require('mongoose'),
	category = require('../models/category');    

describe('Mongodb API', function() {

	describe('Categories Collection', function() {
		var firstCategoryId = null;
//		var secondCategoryId, thirdCategoryId, fourthCategoryId;
		var db = null;

		function generateTestCategory(name) {
		  	var oneCategory = { 
		    	name: name
		  	};

		  	return oneCategory;
		};
/*
		function generateSecondaryCategories() {
			secondDate = new Date("2014/02/07");
			secondCategoryId = null;
		  	category.create(generateTestCategory('Income test 2', 'I', 30, secondDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	secondCategoryId = doc._id;
		  	});			
			thirdCategoryId = null;
			thirdDate = new Date("2014/1/17");
		  	category.create(generateTestCategory('Expense test 3', 'E', 50, thirdDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	thirdCategoryId = doc._id;
		  	});
		  	fourthCategoryId = null;
			fourthDate = new Date("2014/1/31");
		  	category.create(generateTestCategory('Expense test 4', 'E', 150, fourthDate),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	fourthCategoryId = doc._id;
		  	});		
		}
*/
		before(function (done) {
		    db = mongoose.connect(config.dbtest.mongodb);
		    done(); 
		});
/*
		beforeEach(function (done) {
		  	category.create(generateTestCategory('Category test'),
		  	 function(err, doc) {
		  		if (err) { return done(err); }
		    	firstCategoryId = doc._id;
		    	done();
		  	});				
		});
*/
		afterEach(function(done) {
		  category.remove({}, function() {
		    done();
		  });
		});		
/*
		it('should find an category by id', function(done) {
			request(config.apidb.url)
				.get('/entries/' + firstCategoryId)
				.end(function(err, res) {
					if (err) { return done(err); }
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
			generateSecondaryCategories();				
			request(config.apidb.url)
				.get('/entries/')
				.end(function(err, res) {
					if (err) { done(err); }
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
  			generateSecondaryCategories();
			request(config.apidb.url)
				.get('/entries?limitDate={"field":"date","start":"2014/01/01","end":"2014/01/31"}') 
				.end(function(err, res) {
					if (err) { done(err); }
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
  			generateSecondaryCategories();
			request(config.apidb.url)
				.get('/entries?query={"conceptType":"E"}' + 
							'&limitDate={"field":"date","start":"2014/01/01","end":"2014/01/31"}') 
				.end(function(err, res) {
					if (err) { done(err); }
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
  			generateSecondaryCategories();
			request(config.apidb.url)
				.get('/entries?limitNumber={"field":"amount","start":150,"end":3000}') 
				.end(function(err, res) {
					if (err) { done(err); }
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
*/
		it('should save an category', function(done) {
			var newCategory = generateTestCategory('Category test 2');				

			request(config.apidb.url)
				.post('/categories')
				.send(newCategory)
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					res.body.should.have.property('objectId');
					request(config.apidb.url)
						.get('/categories/' + res.body.objectId)
						.end(function(err, res) {
							if (err) { done(err); }
							res.status.should.equal(200);
							res.body.name.should.equal('Category test 2');	
							done();						
					});	
				});
		});
/*
		it('should update an category', function(done) {
			var updatedCategory = { 
			    concept: 'Income test Updated',
			    amount: 301
			};			

			request(config.apidb.url)
				.put('/entries/' + firstCategoryId)
				.send(updatedCategory)
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					res.body.documentsUpdated.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + firstCategoryId)
						.end(function(err, res) {
							if (err) { done(err); }
							res.body.concept.should.equal('Income test Updated');
							res.body.conceptType.should.equal('I');
							res.body.amount.should.equal(301);
							new Date(res.body.date).should.deep.equal(new Date(firstDate));
							done();
					});						
			});
		});

		it('should fail updating a bad property in an category', function(done) {
			var updatedCategory = {
		    	conceptType: 'BAD',
		    	amount: 301
			};			
			request(config.apidb.url)
				.put('/entries/' + firstCategoryId)
				.send(updatedCategory)
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(406);
					done();
			});
		});		

		it('should remove an category by id', function(done) {
			request(config.apidb.url)
				.del('/entries/' + firstCategoryId)
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					request(config.apidb.url)
						.get('/entries/' + firstCategoryId)
						.end(function(err, res) {
							if (err) { done(err); }
							res.status.should.equal(404);
							done();
					});	
				});			
		});
*/
		after(function () {
    		db.connection.close();
  		}); 
		
	});
});