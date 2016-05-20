var models = require('../model');
var Feedback = models.Feedback;
var Comment = models.Comment;

module.exports = function(io) {
  io.on('connection', function(socket) {

    socket.on('addFeedback', function(data) {
      var feedbackText = data.text;
      var coordinates = {
        lat: data.lat,
        lng: data.lng
      };
      var feedbackAuthor = 'Tuntematon';
      if (typeof (data.author) !== undefined && data.author !== '') {
        feedbackAuthor = data.author;
      }
      var feedback = new Feedback({
        text: feedbackText,
        author: feedbackAuthor,
        created: Date.now(),
        coordinates: coordinates
      });
      feedback.save(function(err, feedback) {
        if (!err) {
          io.emit('feedbackAdded', feedback);
        }
      });
    });

    socket.on('addComment', function(data) {
      var id = data.id;
      Feedback.findById(id, function(err, feedback) {
        if (!err) {
          var comment = new Comment({
            text: data.text,
            added: Date.now()
          });
          feedback.addComment(comment);
          feedback.save(function(err, feedback) {
            if (!err) {
              io.emit('commentAdded', feedback);
            }
          });
        }
      });
    });

  });
};