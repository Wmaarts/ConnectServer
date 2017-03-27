'use strict';

var util = require('util');
var mongoose = require('mongoose');
User = mongoose.model('User');

module.exports = {
  getUsers: getUsers
};

function getUsers(req, res) {
    var query = {};
	var result = User.find(query).then(data => {
		return res.json(data);
	})
	.fail(err => handleError(req, res, 500, err));
}

