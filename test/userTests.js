var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var app = require('express')();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/connect-cms');
mongoose.Promise = require('q').Promise;

require('../api/models/photo');
require('../api/models/user');
require('../api/models/service');
require('../api/models/geolocation');
require('../api/helpers/fillTestData')();
var userController = require('../api/controllers/userController');

var SwaggerExpress = require('swagger-express-mw');

SwaggerExpress.create({ appRoot: __dirname + '/../' }, function(err, swaggerExpress) {
	  if (err) { throw err; }

	  // install middleware
	  swaggerExpress.register(app);

	  var port = process.env.PORT || 10010;
	  var server = app.listen(port);
});

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing user routes', function(){
	describe('without params', function(){
		it('should return all users', function(done){
			makeRequest('/users', 200, function(err, res){
				if(err){ return done(err); }
				
				expect(res.body[0]._id).to.equal("58d52617e1b7270dc4714358");
				expect(res.body[1]._id).to.equal("58da5d2878f01000f84b93ec");
				expect(res.body.length).to.equal(2);
				done();
			});
		});
	});

	describe('with id', function(){
		it('should return a specific user', function(done){
			makeRequest('/users/58d52617e1b7270dc4714358', 200, function(err, res){
				if(err){return done(err)}
				
				expect(res.body.role).to.equal("moderator");
				done();
			});
		});

		it('should return 404 on a wrong user', function(done){
			makeRequest('/users/58d52617e1b7270dc4714357', 404, done);
		});
	});

	describe(': creating a new one', function(){
		it('should return the new one', function(done){
			request(app)
		      .post('/users')
		      .send({"name" : "TestUser"})
		      .expect(201)
		      .end(function(err, res) {
		        if (err) done(err);
		        res.body.should.have.property('_id');
		        res.body.should.be.have.property('name', 'TestUser');
		        done();
		      });
		});
	});
});

