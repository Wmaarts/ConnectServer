'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

//Data Access Layer
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/connect-cms');
mongoose.Promise = require('q').Promise;
// /Data Access Layer

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

// Load the models
require('./api/models/user');
require('./api/helpers/fillTestData')();

// Routes
app.use('/users', require('./api/routes/users')(handleError));

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

module.exports = app; // for testing