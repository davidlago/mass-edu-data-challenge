// Required libs
var MongoClient = require('mongodb').MongoClient
var walker = require('./walker')
var fs = require("fs")
var path = require("path")
var async = require("async")

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code')
	var baseDir = '../data'
	var dirList = []
	
	fs.readdir(baseDir, function (err, files) {
	    if (err) { throw err }

	    // Make sure we don't process a new folder until the current one is done and inserted
    	function processFile(index) {
    		var file = files[index];
    		if(fs.lstatSync(baseDir+'/'+file).isDirectory() &&
	    			file !== 'tools'
	    			// && file !== 'educators_teachers'
	    			// && file !== 'financial'
	    			// && file !== 'mcas'
	    			// && file !== 'students'
	    			) {
    				console.log('PROCESSING FOLDER: ' + file)
		        	walker.walk_and_load(file,function(endState) {
						console.log('DONE PROCESSING FOLDER: ' + file);

						// Insert in collection
						endState.forEach(function(myState) {

							var searchParm = {}
							searchParm.ORG_CODE = myState.ORG_CODE
							var insertParm = {}
							insertParm[file] = myState[file]

							
							collection.update(searchParm, {$set: insertParm}, {upsert:true}, function(err,res){});

						})

						// Call next item
						index++;
						if(index<files.length)
							processFile(index)
						else
							console.log('DONE PROCESSING ALL FILES!')

					})
    		}
    		else {
    			// Call next item
				index++;
				if(index<files.length)
				processFile(index)
			}
    	}
    	processFile(0)

	})

})
