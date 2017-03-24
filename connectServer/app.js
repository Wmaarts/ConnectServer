'use strict';

var express = require('express')
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);

var SwaggerExpress = require('swagger-express-mw');
//var app = require('express')();
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


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

// Handlebars 
app.set('view engine', 'html');
app.engine('html', require('hbs').__express); 

require('./config/passport/passport')(passport); // pass passport for configuration

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//required for passport
app.use(session({ secret: 'this-is-the-secret-cookie-for-our-connect-app' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static("public"));

//routes ======================================================================
require('./api/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  var server = app.listen(port);

  var io = require('socket.io').listen(server);
  
  //Socket!
  io.on('connection', function(socket){
  	console.log('a user connected');
  	socket.on('disconnect', function(){
  	    console.log('user disconnected');
  	});
  	var counter = 0;
  	setInterval(function(){
  		counter++;
  		socket.emit('number', counter);
  	}, 1000);
  	
  });
  
  console.log('URL: http://127.0.0.1:' + port);
});

module.exports = app; // for testing