'use strict';
/*
 * MONGODB REST API
 */

var Entry = require('../models/entry');
var underscore = require('underscore');

var _collection = function(collection) {
	if (collection = 'entries') {
		return Entry;
	}
};

module.exports = function(app){
	app.get('/apidb/:collection', function (req, res){
		var filter = {};
		if (req.query.limitDate) {
			var limit = JSON.parse(req.query.limitDate);
			filter[limit.field]= {
					"$gte": new Date(limit.start),
					"$lte": new Date(limit.end)
			};
		}
		if (req.query.limitNumber) {
			var limit = JSON.parse(req.query.limitNumber);
			filter[limit.field]= {
					"$gte": limit.start,
					"$lte": limit.end
			};
		}
		if (req.query.query) {
			var query = JSON.parse(req.query.query);
			underscore.extend(filter, query);		
		}
		_collection(req.params.collection).find(filter,
			function (err, results) {
				if (err) { throw (err); }
				res.header('Content-Type', 'application/json');
				if (results) {
		  			return res.send(results, 200);
				} else {
		  			return res.send('{"error": "No ' + req.params.collection + ' found"}', 404);
				}
		});
	});

	app.get('/apidb/:collection/:id', function (req, res){
		_collection(req.params.collection).findById(req.params.id,
			function (err, result) {
				if (err) { throw (err); }
				res.header('Content-Type', 'application/json');
				if (result) {
		  			return res.send(result, 200);
				} else {
		  			return res.send('{"error": "Object ID not found"}', 404);
				}
		});
	});	

	app.post('/apidb/:collection', function(req, res) {
		_collection(req.params.collection).create(req.body,
			function(err, result) {
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
				return res.send('{"ok": 1, "objectId": "' + result._id + '"}', 200);
		});
	});

	app.put('/apidb/:collection/:id', function(req, res) {
		_collection(req.params.collection).findOne({'_id': req.params.id},
			function(err, doc) {
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
			  			return res.send('{"error": "Object ID not found"}', 404);
					} else {
			  			return res.send('{"ok": 1, "documentsUpdated": ' + number + '}', 200);
					}
			});
		});
	});

	app.del('/apidb/:collection/:id', function (req, res){
		_collection(req.params.collection).remove(req.params.id,
			function (err) {
				if (err) { throw (err); }
				res.header('Content-Type', 'application/json');
				return res.send('{"ok": 1}', 200);
		});
	});
}; 	