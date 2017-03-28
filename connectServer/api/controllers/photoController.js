'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var handleError; //TODO error handling

var mongoose = require('mongoose');

/* As an example, in normal JavaScript, mistyping a variable name creates a new global variable. 
In strict mode, this will throw an error, making it impossible to accidentally create a global variable.*/
var Photo = mongoose.model('Photo'); //don't forget vars

module.exports = {
  postPhoto: createPhoto,
  getPhoto: getPhoto,
  deletePhoto: deletePhoto,
};

// CREATE (POST)
function createPhoto(req, res) {
    var photo = new Photo(req.body);

	photo.save()
		.then(savedPhoto => {
			// console.log("err: "+err); // err makes the code crash derp

			// TODO -> add the photo to a service

			res.json({success: 1, description: "Photo added"});
		})
		.fail(err => handleError(req, res, 500, err));
}

// READ (GET)
function getPhoto(req, res) {
	var query = {};

	//req.swagger contains the path parameters
	query._id = req.swagger.params.id.value;

	var photoResult = Photo.find(query);
	
	photoResult.then(data => {
			// Don't return an array, return the element
			if(req.swagger.params.id){
				data = data[0];
			}
			return res.json(data); // return?
		})
		.fail(err => handleError(req, res, 500, err));
}

// DELETE (DELETE)
function deletePhoto(req, res, next) {
	var query = {};

	query._id = req.swagger.params.id.value; //note _id -> query has to search on the correct name, no misspellings

	var photoResult = Photo.findByIdAndRemove(query);

	photoResult.then(data => {
		res.json({success: 1, description: "Photo deleted"});
	})
	.fail(err => handleError(req, res, 500, err));
}