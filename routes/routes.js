var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles();

module.exports = function(app, user, passport) {

	require('./crud/userRoutes')(app, user, passport, '/user');
	require('./crud/serviceRoutes')(app, user, passport, '/service');
	require('./crud/photoRoutes')(app, user, passport, '/photo');
	require('./crud/geolocationRoutes')(app, user, passport, '/geolocation');
	
	// Swagger documentation page
	app.get('/api-docs', function(req, res) {
    	res.render('documentation/index.html'); 
	});
	
	
    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
    	if(req.user != undefined && req.user.role != 'user') {
    		res.redirect('/crud');
    	}
    	else {
    		res.render('index.html'); // load the index.html file 
    	}
    });
    
    app.get('/crud', user.can('access CRUD'), function(req, res){
    	res.render('crud/index.html');
    })
    

    // LOGIN ===============================
    // show the login form
    app.get('/login', user.can('access home page'), function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') }); 
    });
    
    // process the login form
    app.post('/login', user.can('access home page'), passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
//     app.post('/signup', do all our passport stuff here);

    // PROFILE SECTION =====================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', user.can('access CRUD'), isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
 // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));
    
 // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/'
            }));
    
 // =============================================================================
 // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
 // =============================================================================

     // locally --------------------------------
         app.get('/connect/local', function(req, res) {
             res.render('connect-local.html', { message: req.flash('loginMessage') });
         });
         app.post('/connect/local', passport.authenticate('local-signup', {
             successRedirect : '/', // redirect to the secure profile section
             failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
             failureFlash : true // allow flash messages
         }));

     // facebook -------------------------------
         // send to facebook to do the authentication
         app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

         // handle the callback after facebook has authorized the user
         app.get('/connect/facebook/callback',
             passport.authorize('facebook', {
                 successRedirect : '/',
                 failureRedirect : '/'
             }));

     // google ---------------------------------

         // send to google to do the authentication
         app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

         // the callback after google has authorized the user
         app.get('/connect/google/callback',
             passport.authorize('google', {
                 successRedirect : '/',
                 failureRedirect : '/'
             }));

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}