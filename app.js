
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var database = require('./config/database.js');
var bodyParser = require('body-parser');
var jade = require('jade');
var fs = require('fs');

var SERVER_ROOT = '';

var clientTemplates = fs.readdirSync(__dirname + '/views/client');
var compiledClientTemplates = [];
compiledClientTemplates.push(
  fs.readFileSync(__dirname + '/node_modules/jade/runtime.js', { encoding: 'utf8' })
);
for (var i = 0; i < clientTemplates.length; i++) {
  compiledClientTemplates.push(jade.compileFileClient(
    __dirname + '/views/client/' + clientTemplates[i],
    { name: clientTemplates[i].replace('.jade', '') }
  ));
}
fs.writeFileSync(__dirname + '/public/js/templates.js', compiledClientTemplates.join(''));

mongoose.connect(database.getConnectionUrl());
var datastore = mongoose.connection;

datastore.on("error", function(err) {
  console.error('Failed to connect to DB, exiting...');
});

datastore.on('disconnected', function() {
  console.error('Mongoose connection to DB disconnected');
});

var closeConnection = function() {
  datastore.close(function() {
    console.log('Mongoose default connection with DB disconnected, because application was closed.');
    process.exit(0);
  });
};

process.on('SIGINT', closeConnection).on('SIGTERM', closeConnection);

datastore.once('open', function() {

  var app = express();

  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  app.get(SERVER_ROOT + '/', routes.index);
  app.get(SERVER_ROOT + '/feedback', routes.getFeedback);

  app.post(SERVER_ROOT + '/feedback', routes.addFeedback);
  app.post(SERVER_ROOT + '/comment/:id', routes.addComment);

  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});