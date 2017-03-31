var mongoose = require('mongoose');

console.log('Initializing photo schema');

var photoSchema = new mongoose.Schema({
	firstUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	secondUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	photoString: { type: String}
});

console.log('Giving mongo the photo model');
mongoose.model('Photo', photoSchema);