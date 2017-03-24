'use strict';

var util = require('util');

module.exports = {
  hiya: hiya,
  hiyas: test
};

function hiya(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}

function test(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Diff, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}