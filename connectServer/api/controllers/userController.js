'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
	postUser: addUser,
  	getUsers: getUserList,
	getUser: getUserById,
	putUser: updateUserById,
	deleteUser: deleteUserById,
};


function addUser(req, res) {
	var user = new User(req.body);

	user.save()
		.then(savedUser => {
			res.status(201);
			res.json(savedUser);
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
			res.json(user);
		});
	})
	.fail(err => handleError(req, res, 500, err));
}

function deleteUserById(req, res) {
	var query = {};

	query._id = req.swagger.params.id.value; //note _id -> query has to search on the correct name, no misspellings

	var userResult = User.findByIdAndRemove(query);

	userResult.then(data => {
		res.json({success: 1, description: "User deleted"});
	})
	.fail(err => handleError(req, res, 500, err));
}