var models = require('../model');
var Feedback = models.Feedback;
var Comment = models.Comment;

var SERVER_ROOT = '';

module.exports = function(app) {
  
  app.get(SERVER_ROOT + '/', function(req, res) {
    res.render('index', { root: SERVER_ROOT });
  });
  
  app.get(SERVER_ROOT + '/feedback', function(req, res) {
    Feedback.find(function(err, feedbacks) {
      if (!err) {
        res.send(feedbacks);
      }
    });
  });

};