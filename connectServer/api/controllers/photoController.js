var util = require('util');
var mongoose = require('mongoose');
Photo = mongoose.model('Photo');

module.exports = {
  postPhoto: savePhoto,
};

function savePhoto(req, res, next) {
    console.log("we are inside!");
    console.log(req.body);

    var photo = new Photo(req.body);
	photo.save()
		.then(savedPhoto => {
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(savedPhoto);
			}
		}).fail(err => handleError(req, res, 500, err));
}