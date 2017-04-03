'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var handleError = require('../helpers/errorhandler'); //error handling

var mongoose = require('mongoose');

/* As an example, in normal JavaScript, mistyping a variable name creates a new global variable. 
In strict mode, this will throw an error, making it impossible to accidentally create a global variable.*/
var Photo = mongoose.model('Photo'); //don't forget vars
var Service = mongoose.model('Service');
var moment = require('moment-timezone');

module.exports = {
  postPhoto: addPhoto,
  getPhoto: getPhotoById,
  getAllPhotosByUser: getAllPhotosByUser,
  getAllPhotosByTwoUsers: getAllPhotosByTwoUsers,
  deletePhoto: deletePhotoById,
};

// CREATE (POST)
function addPhoto(req, res) {
	var thisMoment = moment();
    var previousMoment = moment().subtract(1, 'days');

    var photo = new Photo(req.body);

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
		if(err) {
			return handleError(req, res, 500, err);
		}

		photo.save()
			.then(savedPhoto => {
				// TODO check userVisited
				if (contains(service.usersVisited, savedPhoto.firstUserId) === true) {
					// add the photo to a service
					service.photos.push(savedPhoto._id);
					service.save(function (err, service) {
						res.status(201); // new photo posted
						return res.json(savedPhoto);
					});
				}
				else {
					return res.status(304).send("User is not currently present on the service");
				}
				
			})
			.fail(err => handleError(req, res, 500, err));
	});
}

// READ (GET) By Id
function getPhotoById(req, res) {
	var query = {};

	//req.swagger contains the path parameters
	query._id = req.swagger.params.id.value;

	var photoResult = Photo.findById(query);
	
	photoResult.then(data => {
		res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

// READ (GET) By User
function getAllPhotosByUser(req, res) {
	var query = {};

	query = { "$or": [
				{firstUserId : req.swagger.params.id.value},
				{secondUserId : req.swagger.params.id.value}
	]};

	var photoResult = Photo.find(query);
	
	photoResult.then(data => {
		res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

function getAllPhotosByTwoUsers(req, res) {
	var query = {};

	query = 
	{ "$or": [
		{ "$and": [
			{firstUserId : req.swagger.params.firstUserId.value},
			{secondUserId : req.swagger.params.secondUserId.value},
		]},
		{ "$and": [
			{firstUserId : req.swagger.params.secondUserId.value},
			{secondUserId : req.swagger.params.firstUserId.value},
		]}
	]};

	var photoResult = Photo.find(query);
	
	photoResult.then(data => {
		res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}


// DELETE (DELETE)
function deletePhotoById(req, res, next) {
	var query = {};

	query._id = req.swagger.params.id.value; //note _id -> query has to search on the correct name, no misspellings

	var photoResult = Photo.findByIdAndRemove(query);

	photoResult.then(data => {
		res.json({success: 1, description: "Photo deleted"});
	})
	.fail(err => handleError(req, res, 500, err));
}

function contains(arr,obj) {
    return (arr.indexOf(obj) != -1);
}