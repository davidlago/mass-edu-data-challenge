// Required libs
var MongoClient = require('mongodb').MongoClient
var walker = require('./walker')

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code');

	walker.walk_and_load(function(endState) {
		console.log('Done!');
		collection.insert(state, {w: 1}, function(err, records){
  			console.log("Record added as "+records[0]._id);
		});
	})

});
