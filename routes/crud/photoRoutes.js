var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();

module.exports = function(app, user, passport, url) {

	// INDEX 
    app.get(url, user.can('access CRUD'), function(req, res) {
    	var result = Photo.find({}).then(data => {
    		res.render('crud/photos/index.html', {photos: data}); 
    	})
    	.fail(err => res.render('crud/photos/index.html', {err: err}));
    });
	
    // DELETE
    app.get(url + '/delete/:id', user.can('access CRUD'), function(req, res) {
    	var query = {};
    	query._id = req.params.id;

    	var photoResult = Photo.findByIdAndRemove(query);

    	photoResult.then(data => {
    		res.redirect(url);
    	})
    	.fail(err => res.render('crud/photos/index.html', {err: err}));
    });
}
