'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var Service = mongoose.model('Service');
var moment = require('moment-timezone');

module.exports = {
    postService: addService,
    getService: getServiceById,
    getServices: getServiceList,
    putService: updateServiceById,
    deleteService: deleteServiceById,
    postUserOnSite: addUserVisitedById,
};

function addService(req, res) {
    var service = new Service(req.body);

    // TODO: Save Geolocation first
    // Then -> bind the Geolocation._id to the service

	service.save(function (err, service) {
        if (err) {
            return res.status(500).send(err); // error handling
        }
        return res.json({success: 1, description: "Service posted"});
    });
}

function getServiceById(req, res) {
    var query = {};
	query._id = req.swagger.params.id.value;

	var serviceResult = Service.findById(query, function (err, service) {
        if (err) {
            res.status(500).send(err); // err handling
        }
        res.json(service);
    });
}

function getServiceList(req, res) {
    var query = {};
	var result = Service.find(query, function(err, serviceList) {
		return res.json(serviceList);
    });
}

function updateServiceById(req, res) {
    var query = {};
	query._id = req.swagger.params.id.value;

	var serviceResult = Service.findById(query, function (err, service) {
        if (err) {
            return res.status(500).send(err); // err handling
        }

        service.name = req.body.name || service.name;
        service.startDateTime = req.body.startDateTime || service.startDateTime;
        service.endDateTime = req.body.endDateTime || service.endDateTime;
        service.description = req.body.description || service.description;
        
        // This probably works? I just don't know. It works if it exists, probs
        service.geolocation = req.body.geolocation || service.geolocation;


        service.usersVisited = req.body.usersVisited || service.usersVisited;
        service.photos = req.body.photos || service.photos;
        
        service.save(function(err, service) {
            if (err) {
                return res.status(500).send(err); // err handling
            }
            return res.json(service);
        });
    });
}
    
function deleteServiceById(req, res) {
    var query = {};
    query._id = req.swagger.params.id.value;

    var serviceResult = Service.findByIdAndRemove(query, function(err, service) {
        if (err) {
            res.status(500).send(err);
        }
        res.json({success: 1, description: "Service deleted"});
    });
}

function addUserVisitedById(req, res) {
    var thisMoment = moment();
    console.log(thisMoment);
    var previousMoment = moment().subtract(1, 'days');
    console.log(previousMoment);

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
        console.log("inside");
        if (err) {
            res.status(500).send(err); // err handling
            return res.json({});
        }

        console.log(service);
        console.log(req.swagger.params.id.value);

        console.log(contains.call(service.usersVisited, req.swagger.params.id.value));

        if (contains.call(service.usersVisited, req.swagger.params.id.value) === false) {
            service.usersVisited.push(req.swagger.params.id.value);
            console.log("pushed.");
        }
        else {
            return console.log("Todo error handling");
        }

        console.log("about to save");
        service.save(function(err, service) {
            if (err) {
                res.status(500).send(err); // err handling
            }
            res.json(service);
        });
    });
}

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};