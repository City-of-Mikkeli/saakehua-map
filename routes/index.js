var models = require('./../model');
var Feedback = models.Feedback;
var Comment = models.Comment;

var SERVER_ROOT = '';

exports.index = function(req, res){
	res.render('index', {root : SERVER_ROOT});
};

exports.addFeedback = function(req, res){
	var feedbackText = req.body.text;
	var coordinates = {
			lat : req.body.lat,
			lng : req.body.lng
	};
	var feedbackAuthor = 'Tuntematon';
	if(typeof(req.body.author) !== undefined && req.body.author !== ''){
		feedbackAuthor = req.body.author;
	}

	var feedback = new Feedback({
		text : feedbackText,
		author : feedbackAuthor,
		created : Date.now(),
		coordinates : coordinates
	});
	feedback.save(function(err, feedback){
		if(!err){
			res.send(feedback);
		}
	});
};

exports.getFeedback = function(req, res){
	Feedback.find(function(err, feedbacks){
		if(!err){
			res.send(feedbacks);
		}
	});
};

exports.addComment = function(req, res){
	var id = req.param("id");
	Feedback.findById(id, function (err, feedback) {
		if(!err){
			var comment = new Comment({
				text : req.body.text,
				added : Date.now()
			});
			feedback.addComment(comment);
			feedback.save(function(err, feedback){
				if(!err){
					res.send(comment);
				}
			});
		}
	});
};