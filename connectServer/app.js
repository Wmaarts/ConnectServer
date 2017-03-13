'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

//Data Access Layer
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/connect-server');
mongoose.Promise = require('q').Promise;
// /Data Access Layer

// Models
require('./api/models/service');

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
