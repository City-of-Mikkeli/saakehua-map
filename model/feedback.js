var mongoose = require('mongoose');
var commentSchema = require('./comment.js');

var feedbackSchema = mongoose.Schema({
		text : String,
		created : Date,
		author : String,
		coordinates : {
			lat : Number,
			lng : Number
		},
		comments : [commentSchema]
});

feedbackSchema.methods.addComment = function(comment){
	this.comments.push(comment);
};

module.exports = feedbackSchema;