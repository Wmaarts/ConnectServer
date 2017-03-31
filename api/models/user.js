var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

console.log('Initializing user schema');

var roles = ['user', 'moderator', 'admin']

var userSchema = new mongoose.Schema({
	telNr: {type: String},
	role: {type: String, required: true, enum: roles, unique: false, default: "user"},
	photoString: {type: String},
	name: {type: String},
	local            : {
		email        : {type: String},
		password     : String,
	},
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    } 	
});

//generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

console.log('Giving mongo the user model!');
mongoose.model('User', userSchema);