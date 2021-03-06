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

    Service
    	.findOne(query, function (err, service) {
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
    })
    .populate('geolocation')	
    .then(data => {
    	console.log(data);
        return res.json(data);
    })
	.fail(err => {return handleError(req, res, 500, err)});
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

        if(service.geolocation) {
            var geolocationQuery = {
                _id : service.geolocation,
            };

            var geo = Geolocation.findById(geolocationQuery, function(err, geolocation) {
                if (err) {
                    return handleError(req, res, 500, err); // error handling uhm
                }

                if(geolocation) {
                    // Put the Geolocation inside service object
                    serviceClone.geolocation = geolocation;
                }
                return res.json(serviceClone);
            });
        }
        else {
            return res.json(serviceClone);
        }
    });
}

function getServiceList(req, res) {
    var gtDate = new moment(req.swagger.params.gtDate.value);
    var ltDate = new moment(req.swagger.params.ltDate.value);

    var query = {};

    if (req.swagger.params.gtDate.value != undefined) { 
        query.startDateTime = {};
        query.startDateTime.$gt = gtDate; 
    }

    if (req.swagger.params.ltDate.value != undefined) { 
        if (query.startDateTime == undefined) {
            query.startDateTime = {};
        }
        query.startDateTime.$lt = ltDate; 
    }

    // Actual search using built query
    var query = Service
    .find(query)
    
    .limit(req.swagger.params.limit.value)
    .skip(req.swagger.params.offset.value)
    .sort({startDateTime: -1});

    console.log(query);

    var result = query
    .populate('geolocation')    
    .exec(function(err, serviceList) {
        if (err) { //err handling
            return handleError(req, res, 500, err);
        }
        if(serviceList == undefined || serviceList.length <= 0) {
            return res.status(204).send("No Content");
        }
    })
    .then(data => {
        return res.json(data);
    })
    .fail(err => {return handleError(req, res, 500, err)});
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