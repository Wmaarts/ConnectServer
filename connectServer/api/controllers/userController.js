'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
User = mongoose.model('User');

module.exports = {
	postUser: addUser,
  	getUsers: getUserList,
	getUser: getUserById,
};


function addUser(req, res) {
	var user = new User(req.body);

	user.save()
		.then(savedPhoto => {
			res.json({success: 1, description: "User added"});
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
			res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}