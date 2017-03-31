'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var Service = mongoose.model('Service');

module.exports = {
    postService: addService,
    getService: getServiceById,
    getServices: getServiceList,
    putService: updateServiceById,
    deleteService: deleteServiceById,
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
            res.status(500).send(err); // err handling
            res.json({})
        }

        service.name = req.body.name || service.name;
        service.startDate = req.body.startDate || service.startDate;
        service.endDate = req.body.endDate || service.endDate;
        service.description = req.body.description || service.description;
        
        // This probably works? I just don't know. It works if it exists, probs
        service.geolocation = req.body.geolocation || service.geolocation;


        service.usersVisited = req.body.usersVisited || service.usersVisited;
        service.photos = req.body.photos || service.photos;
        
        service.save(function(err, service) {
            if (err) {
                res.status(500).send(err); // err handling
            }
            res.json({success: 1, description: "Service updated"});
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