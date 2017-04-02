var ConnectRoles = require('connect-roles');
var moment = require('moment-timezone');
var roles = new ConnectRoles();

module.exports = function(app, user, passport, url) {

	// INDEX 
    app.get(url, user.can('access CRUD'), function(req, res) {
    	var result = Service.find({}).then(data => {
    		res.render('crud/services/index.html', {services: data}); 
    	})
    	.fail(err => res.render('crud/services/index.html', {err: err}));
    });
	
	// CREATE
    // Get
    app.get(url + '/create', user.can('access CRUD'), function(req, res) {
        res.render('crud/services/create.html'); 
    });
    
    // Post
    app.post(url + '/create', user.can('access CRUD'), function(req, res) {
    	var service = new Service(req.body);
    	
    	service.save().then(savedService => {
    		res.redirect(url);
		})
		.fail(err => res.render('crud/services/create.html', {err: err}));
    });

    // UPDATE
    // Get
    app.get(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
		var query = {};

		//req.swagger contains the path parameters
		query._id = req.params.id;

		var serviceResult = Service.findById(query).then(service => {
			if(service == null){
				res.render('crud/services/index.html', {err: "Service not found!"});
			}
			var data = {};
			
			data.name = service.name;
	        data.startDateTime = service.startDateTime;
	        data.endDateTime = service.endDateTime;
	        data.description = service.description;
	        data.geolocation = service.geolocation;

	        data.usersVisited = service.usersVisited;
	        data.photos = service.photos;
			
			data.startDateTime = moment(data.startDateTime).format('YYYY-MM-DDThh:mm').toString();
			data.endDateTime = moment(data.endDateTime).format('YYYY-MM-DDThh:mm').toString();

	    	res.render('crud/services/edit.html', { model: data }); 
		})
		.fail(err => res.render('crud/services/index.html', {err: err}));
    });
    
    // POST
    app.post(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};
    	query._id = req.params.id;

    	var serviceResult = Service.findById(query, function (err, service) {
            if (err) {
            	res.render('crud/services/index.html', {err: err}); 
            }

            service.name = req.body.name || service.name;
            service.startDateTime = req.body.startDateTime || service.startDateTime;
            service.endDateTime = req.body.endDateTime || service.endDateTime;
            service.description = req.body.description || service.description;
            service.geolocation = req.body.geolocation || service.geolocation;
            
            service.save(function(err, service) {
                if (err) {
                	res.render('crud/services/index.html', {err: err}); // err handling
                }
                return res.redirect(url);
            });
        });
    });

    // DELETE
    app.get(url + '/delete/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};
    	query._id = req.params.id;

    	var serviceResult = Service.findByIdAndRemove(query);
    	
    	serviceResult.then(data => {
    		res.redirect(url);
    	})
    	.fail(err => alert(err));
    	
    	res.redirect(url); 
    });
}
