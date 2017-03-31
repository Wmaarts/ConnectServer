var mongoose = require('mongoose');

console.log('Initializing geolocation schema');

var geolocationSchema = new mongoose.Schema({
	name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
});

console.log('Giving mongo the geolocation model');
mongoose.model('Geolocation', geolocationSchema);