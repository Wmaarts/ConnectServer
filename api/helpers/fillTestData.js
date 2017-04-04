var q = require('q');

var mongoose = require('mongoose');
User = mongoose.model('User');
Geolocation = mongoose.model('Geolocation');
Service = mongoose.model('Service');
Photo = mongoose.model('Photo');
var moment = require('moment-timezone');


function fillUsers(overwrite){
	var testData = [
		{
		    "_id" : '58d52617e1b7270dc4714358',
		    "local" : {
		        "password" : "$2a$08$gRWR3zlvyKUHHkNbM9wFf.uTuIorr/FBOFiHcatQ7V8fk6GseNXW6",
		        "email" : "admin"
		    },
		    "telephoneNumber": 0681000001,
		    "role" : "admin",
		    "__v" : 0
		},
		{ // just a normal user for testing purposes (Photos)
		    "_id" : '58da5d2878f01000f84b93ec', 
			"name": "test",
			"telephoneNumber": 0681000000,
		    "role" : "user",
		    "__v" : 0
		},
		{
		    "_id" : "58e360036c78a407805c896d",
		    "local" : {
		        "password" : "$2a$08$Ewt9Ky7nT5mXsHf4TJop8.ss3Hj12SEgFrMLEQ5rPmj4T6ZeOP0IO",
		        "email" : "mod"
		    },
		    "role" : "moderator",
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
	
	var thisMoment = new moment();
	var tomorrowsMoment = new moment().add(1, 'days');

	var testData = [
		{
			"_id" : "58de464012fdf76df0e221a6",
			"name" : "History-Service",
			"description" : "Desc",
			"startDateTime" : "2016-04-16T16:06:05Z",
			"endDateTime" : "2016-04-16T18:06:05Z",
			"geolocation" : "58de221418c06e4cccd7f3df",
			
		},
		{
			"_id" : "58de464012fdf76df0e221a7",
			"name" : "Current-TestService",
			"description" : "Yes.",
			"startDateTime" : thisMoment,
			"endDateTime" : tomorrowsMoment,
			"geolocation" : "58de221418c06e4cccd7f3e0",
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
			"latitude" : 51.982319,
			"longitude" : 5.338590,
		},
		{
			"_id" : "58de221418c06e4cccd7f3e0",
			"name" : "Avans Hogeschool 's-Hertogenbosch",
			"latitude": 51.688705,
			"longitude" : 5.287003,
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

function fillPhotos(overwrite){
	var testData = [
		{
		    photoString : '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',
		    firstUserId: '58da5d2878f01000f84b93ec', 
		    secondUserId: '58d52617e1b7270dc4714358'
		}
	];

	Photo.find({})
		.then(data => {
			if(overwrite || data.length <= 1){
				console.log('Clearing photos and creating new testdata');
				Photo.remove({}, function(){
					// First remove all previous users, then create the new ones
					
					testData.forEach(function(photo){
						var model = new Photo(photo);
						
						// Error handling
						model.save(function(err){
							if(err) {
								console.error(err);
							}
						});
					})
				});
			} else{
				console.log('Skipping create photo testdata, already present');
			}
			return;
		});
};

module.exports = function(overwrite) {
	q.fcall(fillUsers(overwrite))
		.then(fillGeolocations(overwrite))
		.then(fillServices(overwrite))
		.then(fillPhotos(overwrite))
		; // end fcall
}