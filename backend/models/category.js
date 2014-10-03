'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	ancestors: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}]
});
try {
	
// Compile the model
	mongoose.model('Category', CategorySchema);
} catch (error) {}

module.exports = mongoose.model('Category');