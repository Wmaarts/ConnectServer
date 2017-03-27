var mongoose = require('mongoose');

console.log('Initializing service schema');

var photoSchema = new mongoose.Schema({
	firstUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	secondUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	photo: { type: String}
});

console.log('Giving mongo the photo model');
mongoose.model('Photo', photoSchema);