var handleError;

var util = require('util');
var mongoose = require('mongoose');
Photo = mongoose.model('Photo');

module.exports = {
  postPhoto: savePhoto,
  getPhoto: getPhoto,
};

// POST
function savePhoto(req, res) { //TODO make this work
    console.log("we are inside!");
    console.log(req.body);

    var photo = new Photo(req.body);
	console.log(photo);

	photo.save()
		.then(savedPhoto => {
			console.log("inside saved photo code");
			// console.log("err: "+err); // err makes the code crash derp

			// if(err){ // if it got inside this part of the code, probs no errors? 
			// 	console.log("error");
			// 	return handleError(req, res, 500, err); 
			// }
			// else {
				// res.status(201);
				// res.json(savedPhoto);
				// console.log("response json")
				// res.json({success: 1, description: "Photo added to the list!"});
			// }

			console.log("response json")

			// TODO -> add the photo to a service

			res.json({success: 1, description: "Photo added to the list!"});
		}).fail(err => handleError(req, res, 500, err));


}

function getPhoto(req, res) {
	console.log("inside getPhoto");
	var query = {};

	//req.swagger contains the path parameters
	query._id = req.swagger.params.id.value;

	var photoResult = Photo.find(query);
	
	photoResult.then(data => {
			// Don't return an array, return the element
			if(req.swagger.params.id){
				data = data[0];
				console.log("data: "+data);
			}
			return res.json(data);
		})
		.fail(err => handleError(req, res, 500, err));
}

function deletePhoto(req, res, next) {

}