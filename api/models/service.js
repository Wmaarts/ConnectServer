var mongoose = require('mongoose');

console.log('Initializing service schema');

var serviceSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	startDateTime: {type: Date, required: true},
	endDateTime: {type: Date, required: true},
	geolocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Geolocation'},
	usersVisited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}]
});

console.log('Giving mongo the service model');
mongoose.model('Service', serviceSchema);