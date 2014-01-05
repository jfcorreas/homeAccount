'use strict';
/*
 * MONGODB REST API
 */

var Entry = require('../models/entry');

module.exports = function(app){
	app.get('/apidb/entries/:id', function (req, res){
		Entry.findById(req.params.id, function (err, entry) {
			if (err) { throw (err); }
			if (entry) {
	  			return res.send(entry, 200);
			} else {
	  			return res.send('Entry ID not found', 404);
			}
		});
	});
};