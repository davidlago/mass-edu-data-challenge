// Required libs
var MongoClient = require('mongodb').MongoClient;
var     lazy    = require("lazy"),
        	fs  = require("fs");

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code');



	new lazy(fs.createReadStream('../data/financial/MyVeryBigFile.csv'))
	    .lines
	    .forEach(function(line){
	    	console.log(line.toString());
	    }
	);



  	// var doc1 = {'hello':'doc1'};

  	// collection.insert(doc1, {w:1}, function(err, result) {

  	// if(err)
  	// 	console.log(err);
  	// else
  	// 	console.log('Done!');
});
