var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/connect-cms');
mongoose.Promise = require('q').Promise;

require('./api/models/photo');
require('./api/models/user');
require('./api/models/service');
require('./api/models/geolocation');

var fillTestData = require('./api/helpers/fillTestData');
var geolocationsPromise = fillTestData.fillGeolocationsPromise(true);
var photosPromise = fillTestData.fillPhotosPromise(true);
var servicesPromise = fillTestData.fillServicesPromise(true);
var usersPromise = fillTestData.fillUsersPromise(true);

var Q = require('q');

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = 'test'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run the tests.

console.log("uhm do it?")

// var mongoose = require('mongoose');
// if (process.env.NODE_ENV == "production") {
// 	console.log("[Mongo] Using Production DB");
// 	// mongoose.connect('mongodb://admin:admin@ds139438.mlab.com:39438/connect-cms'); // DEV database
// }
// else {
// 	console.log("[Mongo] Using Development DB");
// 	// mongoose.connect('mongodb://localhost:27017/connect-cms'); // Local database
// }
// mongoose.Promise = require('q').Promise;



Q // STUPID PROMISES, DO PROMISE SHIT!
.all([geolocationsPromise, photosPromise, servicesPromise, usersPromise])
.then(function(data) {
    console.log("inside Q / promises")
    mocha.run(function(failures){
        process.on('exit', function () {
            process.exit(failures);  // exit with non-zero status if there were failures
        });
    });
})
.catch(function(err) {
    console.log(err);
})