'use strict';
/*
 * MONGODB REST API
 */

var Entry = require('../models/entry');
var underscore = require('underscore');

module.exports = function(app){
	app.get('/apidb/entries/', function (req, res){
		Entry.find({}, function (err, entries) {
			if (err) { throw (err); }
			res.header('Content-Type', 'application/json');
			if (entries) {
	  			return res.send(entries, 200);
			} else {
	  			return res.send('{"error": "Entry ID not found"}', 404);
			}
		});
	});

	app.get('/apidb/entries/:id', function (req, res){
		Entry.findById(req.params.id, function (err, entry) {
			if (err) { throw (err); }
			res.header('Content-Type', 'application/json');
			if (entry) {
	  			return res.send(entry, 200);
			} else {
	  			return res.send('{"error": "Entry ID not found"}', 404);
			}
		});
	});	

	app.post('/apidb/entries', function(req, res) {
		Entry.create(req.body, function(err, entry) {
			res.header('Content-Type', 'application/json');
			if (err) {
				if (err.name === 'ValidationError') {
					return res.send(Object.keys(err.errors).map(function(errField) {
						return err.errors[errField].message;
					}).join('. '), 406);
				} else {						
					throw (err);
				}
				return;
			}
			
			return res.send('{"ok": 1, "entryId": "' + entry._id + '"}', 200);
		});
	});

	app.put('/apidb/entries/:id', function(req, res) {
		var entryId = {'_id': req.params.id};
		Entry.findOne(entryId, function(err, doc) {
			if (err) { throw (err); }
			underscore.extend(doc, req.body);
			doc.save(function(err, saved, number) {
				res.header('Content-Type', 'application/json');
				if (err) {
					if (err.name === 'ValidationError') {
						return res.send(Object.keys(err.errors).map(function(errField) {
							return err.errors[errField].message;
						}).join('. '), 406);
					} else {						
						throw (err);
					}
					return;
				}
				if (number === 0) {
		  			return res.send('{"error": "Entry ID not found"}', 404);
				} else {
		  			return res.send('{"ok": 1, "entriesUpdated": ' + number + '}', 200);
				}
			});
		});
	});

	app.del('/apidb/entries/:id', function (req, res){
		Entry.remove(req.params.id, function (err) {
			if (err) { throw (err); }
			res.header('Content-Type', 'application/json');
			return res.send('{"ok": 1}', 200);
		});
	});
}; 	