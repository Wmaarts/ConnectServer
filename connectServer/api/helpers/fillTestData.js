var q = require('q');

var mongoose = require('mongoose');
User = mongoose.model('User');
Geolocation = mongoose.model('Geolocation');


function fillUsers(overwrite){
	var testData = [
		{
		    "_id" : '58d52617e1b7270dc4714358',
		    "local" : {
		        "password" : "$2a$08$gRWR3zlvyKUHHkNbM9wFf.uTuIorr/FBOFiHcatQ7V8fk6GseNXW6",
		        "email" : "admin"
		    },
		    "role" : "moderator",
		    "__v" : 0
		},
		{ // just a normal user for testing purposes (Photos)
		    "_id" : '58da5d2878f01000f84b93ec',
			"name": "test",
		    "role" : "user",
		    "__v" : 0
		}
	];

	User.find({})
		.then(data => {
			if(overwrite || data.length <= 1){
				console.log('Clearing users and creating new testdata');
				User.remove({}, function(){
					// First remove all previous users, then create the new ones
					
					testData.forEach(function(user){
						var model = new User(user);
						
						// Error handling
						model.save(function(err){
							console.error(err);
						});
					})
				});
			} else{
				console.log('Skipping create users testdata, already present');
			}
			return;
		});
};

function fillGeolocations(overwrite) {
	var testData = [
		{
			"_id" : "58de221418c06e4cccd7f3df",
			"name" : "Connect Revius Wijk Lyceum",
			"longitude" : 51.982319,
			"latitude" : 5.338590,
		},
		{
			"_id" : "58de221418c06e4cccd7f3e0",
			"name" : "Avans Hogeschool 's-Hertogenbosch",
			"longitude" : 51.688705,
			"latitude": 5.287003,
		},
	];

	Geolocation.find({}, function(err, geolocations) {
		if (overwrite || geolocations.length <= 1) {
			console.log('Clearing geolocations and creating new testdata');
			Geolocation.remove({}, function(){
				// First remove all previous users, then create the new ones
				
				testData.forEach(function(newGeo){
					var model = new Geolocation(newGeo);
					
					// Error handling
					model.save(function(err){
						console.error(err); // oh no.
					});
				})
			});
		} 
		else {
			console.log('Skipping create geolocations testdata, already present');
		}
	});
}

//function fillTestAuthors(overwrite){
//	Book.findOne({title: 'One Flew Over Shit'}).exec(function(err, book){
//		if (err) return handleError(err);
//		console.log(book._id);
//		
//		var testData = [
//			// Vul hier je testdata voor authors in 
//			// {}, {}, {}
//			{
//				firstName: "Wouter",
//				lastName: "Aarts",
//				birthDate: new Date(),
//				country: "UK",
//				ranking: 2,
//				books: [book._id]
//			}
//		];
//		console.log(testData);
//	
//		Author.find({}).then(data => {
//			// Als er nog geen author zijn vullen we de testdata
//			if(overwrite || data.length == 0){
//				console.log('Creating authors testdata');
//				
//				testData.forEach(function(author){
//					new Author(author).save();
//				});
//			} else{
//				console.log('Skipping create authors testdata, already present');
//			}
//		});
//	});
//};

module.exports = function(){
	var overwrite = true;
	q.fcall(fillUsers(overwrite))
		.then(fillGeolocations(overwrite)); //.then(fillTestAuthors(overwrite));
}