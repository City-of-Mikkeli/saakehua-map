var mongoose = require('mongoose');
var commentSchema = require('./comment.js');
var feedbackSchema = require('./feedback.js');

exports.Comment = mongoose.model('Comment', commentSchema);
exports.Feedback = mongoose.model('Feedback', feedbackSchema);