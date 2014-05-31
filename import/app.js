// Required libs
var MongoClient = require('mongodb').MongoClient,
         loader = require("./loader");

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code');


	loader.loadJSON({
						folder: "financial",
						path: "../data/financial/per_pupil_expenditure_report_2005_2012.json",
						collection: collection
					});

});
