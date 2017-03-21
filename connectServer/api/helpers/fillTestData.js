var q = require('q');

var mongoose = require('mongoose');
User = mongoose.model('User');
//Author = mongoose.model('Author');

/*
 * TODO:!!! Le OLDe copypasterino
 */


function fillUsers(overwrite){
	var testData = [
		{
			role: 'moderator', 
			name: 'Wouter',
			password: 'password',
			telNr: '0345923091', 
			photo: 'thisIsAPhoto'
		},
		{
			role: 'moderator', 
			name: 'Mark-Jan',
			password: 'password',
			telNr: '099220192', 
			photo: 'thisIsYourPhoto'
		}
	];

	User.find({})
		.then(data => {
			if(overwrite || data.length == 0){
				console.log('Creating users testdata');
				
				testData.forEach(function(user){
					new User(user).save();
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