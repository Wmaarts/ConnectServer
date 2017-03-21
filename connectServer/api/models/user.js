var mongoose = require('mongoose');

console.log('Initializing user schema');

var userSchema = new mongoose.Schema({
	role: {type: String, required: true},
	name: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	telNr: {type: Number, required: true},
	photo: { type: String}
});

console.log('Giving mongo the user model');
mongoose.model('User', userSchema);

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