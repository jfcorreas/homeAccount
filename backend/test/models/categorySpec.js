'use strict';

var expect = require('chai').expect,
    should = require('chai').should(),
    config = require('../../config');

var mongoose = require('mongoose'),
    category = require('../../models/category');

describe('Models', function () {

  describe('Category', function () {

    var currentCategory = null;
    var db = null;

    before(function (done) {
      db = mongoose.connect(config.dbtest.mongodb);
      done(); 
    });

    beforeEach(function (done) {
      var oneCategory = new category({ 
        name: 'Category test'
      });
      oneCategory.save(function(err, doc) {
        if (err) { return done(err); }
        currentCategory = doc;
        done();
      });
    });

    afterEach(function(done) {
      category.remove({}, function() {
        done();
      });
    });

    it('should exist', function () {
      should.exist(currentCategory);
    });

    it('should contain: name', function (done) {
      category.findOne({name: 'Category test'})
        .exec(function(err, doc) {
          expect(doc.name).to.equal('Category test');
          done();
        });
    });

    after(function () {
      db.connection.close();
    }); 
    
  });
});