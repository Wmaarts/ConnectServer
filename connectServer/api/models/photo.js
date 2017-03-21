var mongoose = require('mongoose');

console.log('Initializing service schema');

var photoSchema = new mongoose.Schema({
	firstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	secondUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	photo: { type: String}
});

console.log('Giving mongo the photo model');
mongoose.model('Photo', photoSchema);

/*
TODO: Validation
- Firstname: Verplicht, String
- Lastname: Verplicht, String
- Birthdate: Verplicht, Date, voor vandaag
- Country: String, default: NL
- Ranking: Number, unique, boven 0
- Books: Array van book id's
*/

/*
TODO: 
- De benodigde extra validation
- De benodigde static methods
- De benodigde instance methods
*/