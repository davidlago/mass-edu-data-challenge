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

	var do_not_process = ["tools"]
	// var do_not_process ["tools", "educators_teachers", "financial", "mcas", "students"]
    				 
	walker.walk_and_load({
	  dirBase: baseDir
  , collection: collection
  , do_not_process: do_not_process
  })
  /*
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
  */
})
