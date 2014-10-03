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
		var secondCategoryId, thirdCategoryId, fourthCategoryId;
		var db = null;

		function generateTestCategory(name) {
		  	var oneCategory = { 
		    	name: name
		  	};

		  	return oneCategory;
		};

		function generateSecondaryCategories() {
			secondCategoryId = null;
		  	category.create(generateTestCategory('Category test 2'),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	secondCategoryId = doc._id;
		  	});			
			thirdCategoryId = null;
		  	category.create(generateTestCategory('Category test 3'),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	thirdCategoryId = doc._id;
		  	});
		  	fourthCategoryId = null;
		  	category.create(generateTestCategory('Category test 4'),
		  	  function(err, doc) {
		  		if (err) { throw err; }
		    	fourthCategoryId = doc._id;
		  	});		
		}

		before(function (done) {
		    db = mongoose.connect(config.dbtest.mongodb);
		    done(); 
		});

		beforeEach(function (done) {
		  	category.create(generateTestCategory('Category test'),
		  	 function(err, doc) {
		  		if (err) { return done(err); }
		    	firstCategoryId = doc._id;
		    	done();
		  	});				
		});

		afterEach(function(done) {
		  category.remove({}, function() {
		    done();
		  });
		});		

		it('should find an category by id', function(done) {
			request(config.apidb.url)
				.get('/categories/' + firstCategoryId)
				.end(function(err, res) {
					if (err) { return done(err); }
					res.status.should.equal(200);
					res.body.should.have.property('_id');
					res.body.name.should.equal('Category test');
					done();
				});
		});

		it('should get all categories', function(done) {
			generateSecondaryCategories();				
			request(config.apidb.url)
				.get('/categories/')
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(200);
					res.body.length.should.equal(4);
					res.body[0].should.have.property('_id');
					res.body[0].name.should.equal('Category test');
					res.body[1].should.have.property('_id');
					res.body[1].name.should.equal('Category test 2');			
					done();
				});
		});		

		it('should save an category', function(done) {
			var newCategory = generateTestCategory('Category test saved');				

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
							res.body.name.should.equal('Category test saved');	
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
*/
		it('should remove an category by id', function(done) {
			request(config.apidb.url)
				.del('/categories/' + firstCategoryId)
				.end(function(err, res) {
					if (err) { done(err); }
					res.status.should.equal(200);
					res.body.ok.should.equal(1);
					request(config.apidb.url)
						.get('/categories/' + firstCategoryId)
						.end(function(err, res) {
							if (err) { done(err); }
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