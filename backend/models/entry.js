'use strict';

var mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
	concept: {
		type: String,
		required: true
	},
	conceptType: {
		type: String,
		required: true,
		uppercase: true,
		enum: ['I','E']	// Income, Expense
	},
	amount: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now 	
	}
});
try {
	mongoose.model('Entry', EntrySchema);
} catch (error) {}

module.exports = mongoose.model('Entry');