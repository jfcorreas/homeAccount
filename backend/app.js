'use strict';
/**
 * Module dependencies.
 */

var express = require('express')
  //, routes = require('./routes')
  , config = require('./config');

var app = module.exports = express.createServer();

var db = null;

// Configuration

app.configure(function(){
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  db = require('mongoose').connect(config.dbtest.mongodb);
});

app.configure('production', function(){
  app.use(express.errorHandler());
  db = require('mongoose').connect(config.db.mongodb);
});

// Routes

//app.get('/', routes.index);
require('./routes/entries')(app);

app.listen(3000, function(){
  console.log("HomeAccount Backend listening on port %d in %s mode", app.address().port, app.settings.env);
});
