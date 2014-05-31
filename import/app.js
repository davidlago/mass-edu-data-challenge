// Required libs
var MongoClient = require('mongodb').MongoClient
var walker = require('./walker')

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code');

	var state = walker.walk_and_load()

});
