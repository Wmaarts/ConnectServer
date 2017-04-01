var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();

module.exports = function(app, user, passport, url) {

	// INDEX 
    app.get(url, user.can('access CRUD'), function(req, res) {
    	var result = User.find({}).then(data => {
    		res.render('crud/users/index.html', {users: data}); 
    	})
    	.fail(err => handleError(req, res, 500, err));
    });
	
	// CREATE
    app.get(url + '/create', user.can('access CRUD'), function(req, res) {
        res.render('crud/users/create.html'); 
    });

    // UPDATE
    app.get(url + '/edit/:id', user.can('access CRUD'), function(req, res) {
    	res.render('crud/users/edit.html'); 
    });

    // UPDATE
    app.get(url + '/delete/:id', user.can('access CRUD'), function(req, res) {
    	res.render('crud/users/edit.html'); 
    });
}
