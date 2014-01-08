'use strict';
/*
 * MONGODB REST API
 */

var Entry = require('../models/entry');

module.exports = function(app){
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
		Entry.create(req.body, function(err, doc) {
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
			
			return res.send('{"ok": 1, "entryId": "' + doc._id + '"}', 200);
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