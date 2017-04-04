'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var Service = mongoose.model('Service');
var Geolocation = mongoose.model('Geolocation');
var moment = require('moment-timezone');

var handleError = require('../helpers/errorhandler')

module.exports = {
    getCurrentService: getServiceCurrentlyRunning,
    getService: getServiceById,
    getServices: getServiceList,
    postUserOnSite: addUserVisitedById,
};

function getServiceCurrentlyRunning(req, res) {
    var thisMoment = moment();
    var previousMoment = moment().subtract(1, 'days');

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

        var serviceClone = {};

        if(service == undefined) {
            return res.status(204).send("No Content");
        }

        serviceClone._id = service._id;
        serviceClone.name = service.name;
        serviceClone.description = service.description;
        serviceClone.startDateTime = service.startDateTime;
        serviceClone.endDateTime = service.endDateTime;
        serviceClone.usersVisited = service.usersVisited;
        serviceClone.photos = service.photos;

        var geolocationQuery = {
            _id : service.geolocation,
        };

        var geo = Geolocation.findById(geolocationQuery, function(err, geolocation) {
            if (err) {
                return handleError(req, res, 500, err); // error handling uhm
            }

            // Put the Geolocation inside service object
            serviceClone.geolocation = geolocation;
            return res.json(serviceClone);
        });
    });
}

function getServiceById(req, res) {
    var query = {};
	query._id = req.swagger.params.id.value;

	var serviceResult = Service.findById(query, function (err, service) {
        if (err) {
            return handleError(req, res, 500, err);
        }

        if(service == undefined) {
            return res.status(204).send("No Content");
        }

        var serviceClone = {};

        serviceClone._id = service._id;
        serviceClone.name = service.name;
        serviceClone.description = service.description;
        serviceClone.startDateTime = service.startDateTime;
        serviceClone.endDateTime = service.endDateTime;
        serviceClone.usersVisited = service.usersVisited;
        serviceClone.photos = service.photos;

        var geolocationQuery = {
            _id : service.geolocation,
        };

        var geo = Geolocation.findById(geolocationQuery, function(err, geolocation) {
            if (err) {
                return handleError(req, res, 500, err); // error handling uhm
            }

            // Put the Geolocation inside service object
            serviceClone.geolocation = geolocation;
            return res.json(serviceClone);
        });
    });
}

function getServiceList(req, res) {
    var gtDate = new moment(req.swagger.params.gtDate.value);
    var ltDate = new moment(req.swagger.params.ltDate.value);

    var query = {};

    if (req.swagger.params.gtDate.value != undefined) { 
        // if (query.startDateTime == undefined) {
            query.startDateTime = {};
        // }
        query.startDateTime.$gt = gtDate; 
    }

    if (req.swagger.params.ltDate.value != undefined) { 
        if (query.startDateTime == undefined) {
            query.startDateTime = {};
        }
        query.startDateTime.$lt = ltDate; 
    }

    // Actual search using built query
    var result = Service.find(query, function(err, serviceList) {
        if (err) { //err handling
            return handleError(req, res, 500, err);
        }

        var serviceListClone = [];

        var itemsProcessed = 0;

        function serviceJsonCallback() {
            return res.json(serviceListClone);
        };

        if(serviceList == undefined || serviceList.length <= 0) {
            return res.status(204).send("No Content");
        }

        // Adding Geolocations to the Services
        serviceList.forEach(function(service, index, array) {
            var serviceClone = {};

            serviceClone._id = service._id;
            serviceClone.name = service.name;
            serviceClone.description = service.description;
            serviceClone.startDateTime = service.startDateTime;
            serviceClone.endDateTime = service.endDateTime;
            serviceClone.usersVisited = service.usersVisited;
            serviceClone.photos = service.photos;

            var geolocationQuery = {
                _id : service.geolocation,
            };

            var geo = Geolocation.findById(geolocationQuery, function(err, geolocation) {
                if (err) {
                    return handleError(req, res, 500, err); // error handling uhm
                }

                // Put the Geolocation inside service object
                serviceClone.geolocation = geolocation;
                serviceListClone.push(serviceClone);

                itemsProcessed++;
                if (itemsProcessed === array.length) {
                    serviceJsonCallback();
                }
            });
        });
    });
}

function addUserVisitedById(req, res) {
    var thisMoment = moment();
    var previousMoment = moment().subtract(1, 'days');

    var query = {
        "$and" : [
            {
                startDateTime : { 
                    $lt: thisMoment, 
                    $gt: previousMoment, 
                },
            },
    ]};
    
    var serviceResult = Service.findOne(query, function(err, service) {
        if (err) {
            return handleError(req, res, 500, err);
        }

        if (contains(service.usersVisited, req.body._id) === false) {
            service.usersVisited.push(req.body._id);
        }
        else {
            return res.json(service); // no modification
        }

        service.save(function(err, service) {
            if (err) {
                
                return res.status(500).send(err); // err handling
            }
            res.status(200);
            return res.json(service);
        });
    });
}

function contains(arr,obj) {
    return (arr.indexOf(obj) != -1);
}