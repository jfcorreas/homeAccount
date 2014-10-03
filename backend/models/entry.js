'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EntrySchema = new Schema({
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
	},
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}]	
});
try {
	
// Compile the model
	mongoose.model('Entry', EntrySchema);
} catch (error) {}

module.exports = mongoose.model('Entry');