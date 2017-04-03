var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();

module.exports = function(app, user, passport, url) {

	// INDEX 
    app.get(url, user.can('access CRUD'), function(req, res) {
    	var result = User.find({}).then(data => {
    		res.render('crud/users/index.html', {users: data}); 
    	})
    	.fail(err => res.render('crud/users/index.html', {err: err}));
    });
	
	// CREATE
    // Get
    app.get(url + '/create', user.can('access CRUD'), function(req, res) {
        res.render('crud/users/create.html'); 
    });
    
    // Post
    app.post(url + '/create', user.can('access CRUD'), function(req, res) {
    	var user = new User(req.body);
    	
    	user.save().then(savedUser => {
    		res.redirect(url);
		})
		.fail(err => res.render('crud/users/create.html', {err: err}));
    });

    // UPDATE
    // Get
    app.get(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
		var query = {};

		//req.swagger contains the path parameters
		query._id = req.params.id;

		var userResult = User.findById(query).then(data => {
			if(data == null){
				res.render('crud/users/index.html', {err: "User not found!"});
			}
	    	res.render('crud/users/edit.html', { model: data }); 
		})
		.fail(err => res.render('crud/users/index.html', {err: err}));
    });
    
    // Post
    app.post(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};

    	//req.swagger contains the path parameters
    	query._id = req.params.id;

    	var userResult = User.findById(query).then(user => { // callback method
    		user.name = req.body.name || user.name;
    		user.role = req.body.role || user.role;
    		user.telephoneNumber = req.body.telephoneNumber || user.telephoneNumber;
    		
    		// Save user
    		user.save(function (err, user) { // also a javascript callback
    			if (err) {
    				res.render('crud/users/index.html', {err: err}); // error handling
    			}
    			res.redirect(url);
    		});
    	})
    	.fail(err => res.render('crud/users/index.html', {err: err}));
    });

    // DELETE
    app.get(url + '/delete/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};
    	query._id = req.params.id;

    	var userResult = User.findByIdAndRemove(query);

    	userResult.then(data => {
    		res.redirect(url);
    	})
    	.fail(err => alert(err));
    	
    	res.redirect(url); 
    });
}
