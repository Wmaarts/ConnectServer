var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();

module.exports = function(app, user, passport, url) {

	// INDEX 
    app.get(url, user.can('access CRUD'), function(req, res) {
    	var result = Geolocation.find({}).then(data => {
    		res.render('crud/geolocations/index.html', {locations: data}); 
    	})
    	.fail(err => res.render('crud/geolocations/index.html', {err: err}));
    });
    
    // CREATE
    // Get
    app.get(url + '/create', user.can('access CRUD'), function(req, res) {
        res.render('crud/geolocations/create.html'); 
        
        var io = require('socket.io').listen(server);
        
        // Socket!
        io.on('connection', function(socket){
        	var counter = 0;
        	setInterval(function(){
        		counter++;
        		socket.emit('number', counter);
        	}, 200);
        });
    });
    
    // Post
    app.post(url + '/create', user.can('access CRUD'), function(req, res) {
    	var geolocation = new Geolocation(req.body);
    	
    	geolocation.save().then(savedGeolocation => {
    		res.redirect(url);
		})
		.fail(err => res.render('crud/geolocations/create.html', {err: err}));
    });
    
    // UPDATE
    // Get
    app.get(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
		var query = {};

		//req.swagger contains the path parameters
		query._id = req.params.id;

		var geolocationResult = Geolocation.findById(query).then(data => {
			if(data == null){
				res.render('crud/geolocations/index.html', {err: "Geolocation not found!"});
			}
	    	res.render('crud/geolocations/edit.html', { model: data }); 
		})
		.fail(err => res.render('crud/geolocations/index.html', {err: err}));
    });
    
    // Post
    app.post(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};

    	//req.swagger contains the path parameters
    	query._id = req.params.id;

    	var geolocationResult = Geolocation.findById(query).then(geolocation => { // callback method
    		geolocation.name = req.body.name || geolocation.name;
    		geolocation.latitude = req.body.latitude || geolocation.latitude;
    		geolocation.longitude = req.body.longitude || geolocation.longitude;

    		// Save user
    		geolocation.save(function (err, geolocation) { // also a javascript callback
    			if (err) {
    				res.render('crud/geolocations/index.html', {err: err}); // error handling
    			}
    			res.redirect(url);
    		});
    	})
    	.fail(err => res.render('crud/geolocations/index.html', {err: err}));
    });
	
    // DELETE
    app.get(url + '/delete/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};
    	query._id = req.params.id;

    	var locationResult = Geolocation.findByIdAndRemove(query);

    	locationResult.then(data => {
    		res.redirect(url);
    	})
    	.fail(err => res.render('crud/geolocations/index.html', {err: err}));
    });
}
