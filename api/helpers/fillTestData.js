var q = require('q');

var mongoose = require('mongoose');
User = mongoose.model('User');
Geolocation = mongoose.model('Geolocation');
Service = mongoose.model('Service');


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
							if(err) {
								console.error(err);
							}
						});
					})
				});
			} else{
				console.log('Skipping create users testdata, already present');
			}
			return;
		});
};

function fillServices(overwrite) {
	var testData = [
		{
			"_id" : "58de464012fdf76df0e221a6",
			"name" : "Test-Service",
			"description" : "Desc",
			"startDateTime" : "2016-04-16T16:06:05Z",
			"endDateTime" : "2016-04-16T18:06:05Z",
		},
	];

	Service.find({}, function(err, services) {
		if (overwrite || services.length <= 1) {
			console.log('Clearing services and creating new testdata');
			Service.remove({}, function(){
				// First remove all previous users, then create the new ones
				
				testData.forEach(function(newService){
					var model = new Service(newService);
					
					// Error handling
					model.save(function(err) {
						if(err) {
							console.error(err); // oh no.
						}
					});
				})
			});
		} 
		else {
			console.log('Skipping create services testdata, already present');
		}
	});
}

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
						if(err) {
							console.error(err); // oh no.
						}
					});
				})
			});
		} 
		else {
			console.log('Skipping create geolocations testdata, already present');
		}
	});
}

module.exports = function() {
	var overwrite = true;
	q.fcall(fillUsers(overwrite))
		.then(fillServices(overwrite))
		.then(fillGeolocations(overwrite));
}