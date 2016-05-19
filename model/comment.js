var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	text : String,
	added : Date
});

module.exports = commentSchema;