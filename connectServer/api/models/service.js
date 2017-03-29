var mongoose = require('mongoose');

console.log('Initializing service schema');

var serviceSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	location: { type: mongoose.Schema.Types.ObjectId, ref: 'GeoLocation'},
	usersVisited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	photo: { type: String}
});

console.log('Giving mongo the service model');
mongoose.model('Service', serviceSchema);