'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Service = mongoose.model('Service');
var handleError = require('../helpers/errorhandler')
var moment = require('moment-timezone');

module.exports = {
	postUser: addUser,
  	getUsers: getUserList,
	getUser: getUserById,
	getUserMatch: matchUser,
	putUser: updateUserById,
};

function matchUser(req, res){
	// Get service currently running
    var thisMoment = moment();
    var previousMoment = moment().subtract(1, 'days');

	var query = {
        "$and" : [
            {
                startDateTime : {
                    $lt: thisMoment, 
                    $gt: previousMoment, 
                },
            },
    ]};

    Service.findOne(query, function (err, service) {
        if(err) {return handleError(req, res, 500, err);}
        
        if(service == undefined || service.usersVisited == undefined || 
        		service.usersVisited.length <= 1) //With only 1 user at the service it's hard to find a match. =)
        { 
        	console.log("No content. Usersvisited: ");
        	console.log(service.usersVisited);
        	res.status(204);
        	return res.json("No content");
        }

        // Select a random user that is not you!
        var rand = Math.floor((Math.random() * service.usersVisited.length) + 0);
        var selectedMatch = service.usersVisited[rand]
        while(selectedMatch != req.swagger.params.id.value){
        	selectedMatch = service.usersVisited[Math.floor((Math.random() * service.usersVisited.length) + 0)]
        }
        
        var secondQuery = {};
        secondQuery._id = selectedMatch
    	
        console.log("Selected match: "  + selectedMatch);
        console.log(selectedMatch);

    	var userResult = User.findById(secondQuery).then(data => {
    		if(data == null){return handleError(req, res, 500, "This user must exist");}
    		console.log("Json return: ");
    		console.log(data);
    		return res.json(data);
    	})
    	.fail(err => handleError(req, res, 500, err));
    });
}

function addUser(req, res) {
	var user = new User(req.body);

	user.save().then(savedUser => {
			res.status(201);
			return res.json(savedUser);
		})
	.fail(err => handleError(req, res, 500, err));
}

function getUserList(req, res) {
	var query = {};
	var result = User.find(query).then(data => {
		return res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

function getUserById(req, res) {
	var query = {};

	//req.swagger contains the path parameters
	query._id = req.swagger.params.id.value;

	var userResult = User.findById(query).then(data => {
		if(data == null){
			res.status(404)
			return res.json("Not found");
		}
		return res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

function updateUserById(req, res) {
	var query = {};

	//req.swagger contains the path parameters
	query._id = req.swagger.params.id.value;

	var userResult = User.findById(query).then(user => { // callback method
		user.name = req.body.name || user.name;
		user.role = req.body.role || user.role;
		user.telephonenumber = req.body.telephonenumber || user.telephonenumber;
		user.photo = req.body.photo || user.photo;

		// Save user
		user.save(function (err, user) { // also a javascript callback
			if (err) {
				return res.status(500).send(err); // error handling
			}
			res.status(200);
			return res.json(user);
		});
	})
	.fail(err => handleError(req, res, 500, err));
}