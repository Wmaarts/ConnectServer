var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

var mongoose = require('mongoose');
User = mongoose.model('User');

/*
	TODO:
	- Populate boeken
	- Paging:
		QueryString variabelen pageSize, PageIndex
		Gesorteerd op ranking
	- Filtering: QueryString variabele: country
	- Filtering: QueryString variabele: fullName
	- Projecting:
		fullname is een property die opgehaald wordt
		age is een property die opgehaald wordt
		numberOfBooks is een property die opgehaald wordt
*/
function getUsers(req, res){
	var query = {};
	var result = User.find(query).then(data => {
		return res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

function getUserById(req, res){
	var query = {};
	if(req.params.name){
		console.log("Got name: " + req.params.name);
		query.name = req.params.name;
	} 

	var result = User.find(query);

	console.log(query);
	result.then(data => {
			// Don't return an array, return the element
			if(req.params.id){
				data = data[0];
			}
			return res.json(data);
		})
		.fail(err => handleError(req, res, 500, err));
}

function addUser(req, res){
	var author = new User(req.body);
	author.save()
		.then(savedAuthor => {
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(savedAuthor);
			}
		}).fail(err => handleError(req, res, 500, err));
}

/*
	TODO:
	- Vind Author
	- Book in collectie books aanmaken als die niet bestaat 
	- Book ID refereren vanuit Author
	- Author met nieuw book teruggeven
	- Mocht iets van dit mis gaan dan handleError(req, res, statusCode, err) aanroepen
*/
//function addBook(req, res){
//	res.json({});
//}

/*
	TODO:
	- Vind Author by :id,
	- Vind Book bij author met :bookId,
	- Verwijder boek van Author
	- Author zonder betreffende book teruggeven
	- Mocht iets van dit mis gaan dan handleError(req, res, statusCode, err) aanroepen
*/
//function deleteBook(req, res){
//	res.json({});
//}

// Routing
router.route('/')
	.get(getUsers)
	.post(getUsers);

router.route('/:name')
	.get(getUserById);

//router.route('/:id/books')
//	.post(addBook);

//router.route('/:id/books/:bookId')
//	.delete(deleteBook);

// Export
module.exports = function (errCallback){
	console.log('Initializing authors routing module');
	
	handleError = errCallback;
	return router;
};