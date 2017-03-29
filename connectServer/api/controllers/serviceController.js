'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://www.w3schools.com/js/js_strict.asp
*/

var mongoose = require('mongoose');
var Service = mongoose.model('Service');

module.exports = {
    postService: addService,

};

function addService(req, res) {
    var service = new Service(req.body);

	service.save(function (err, service) {
        if (err) {
            res.status(500).send(err); // error handling
        }
        res.json({success: 1, description: "User posted"});
    });
}

