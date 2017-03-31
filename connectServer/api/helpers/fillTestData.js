var q = require('q');

var mongoose = require('mongoose');
User = mongoose.model('User');


function fillUsers(overwrite){
	var testData = [
		{
		    "_id" : '58d52617e1b7270dc4714358',
		    "local" : {
		        "password" : "$2a$08$gRWR3zlvyKUHHkNbM9wFf.uTuIorr/FBOFiHcatQ7V8fk6GseNXW6",
		        "email" : "admin"
		    },
		    "role" : "moderator",
		    "__v" : 0
		},
		{ // just a normal user for testing purposes (Photos)
		    "_id" : '58da5d2878f01000f84b93ec',
			"name": "test",
		    "role" : "user",
		    "__v" : 0
		}
	];

	User.find({})
		.then(data => {
			if(overwrite || data.length <= 1){
				console.log('Clearing users and creating new testdata');
				User.remove({}, function(){
					// First remove all previous users, then create the new ones
					
					testData.forEach(function(user){
						var model = new User(user);
						
						// Error handling
						model.save(function(err){
							console.error(err);
							model.save(err);
						});
					})
				});
			} else{
				console.log('Skipping create users testdata, already present');
			}
			return;
		});
};

//function fillTestAuthors(overwrite){
//	Book.findOne({title: 'One Flew Over Shit'}).exec(function(err, book){
//		if (err) return handleError(err);
//		console.log(book._id);
//		
//		var testData = [
//			// Vul hier je testdata voor authors in 
//			// {}, {}, {}
//			{
//				firstName: "Wouter",
//				lastName: "Aarts",
//				birthDate: new Date(),
//				country: "UK",
//				ranking: 2,
//				books: [book._id]
//			}
//		];
//		console.log(testData);
//	
//		Author.find({}).then(data => {
//			// Als er nog geen author zijn vullen we de testdata
//			if(overwrite || data.length == 0){
//				console.log('Creating authors testdata');
//				
//				testData.forEach(function(author){
//					new Author(author).save();
//				});
//			} else{
//				console.log('Skipping create authors testdata, already present');
//			}
//		});
//	});
//};

module.exports = function(){
	var overwrite = true;
	q.fcall(fillUsers(overwrite)); //.then(fillTestAuthors(overwrite));
}