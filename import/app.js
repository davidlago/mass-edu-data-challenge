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
})
