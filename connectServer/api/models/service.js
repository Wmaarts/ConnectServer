var mongoose = require('mongoose');

console.log('Initializing service schema');

var serviceSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	date: {type: Date, required: true},
});

console.log('Giving mongo the service model');
mongoose.model('Service', serviceSchema);

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