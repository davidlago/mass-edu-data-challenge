// Required libs
var MongoClient = require('mongodb').MongoClient
var fileutil = require('./fileutil')
var loader = require('./loader')
var path = require("path")
var async = require("async")
var field_index = require('./field_index')
var _ = require('underscore')

var walk_path = path.normalize(__dirname+"/"+"../data")
var do_not_process = ["tools"]
// var do_not_process ["tools", "educators_teachers", "financial", "mcas", "students"]

function one_file(filename, callback) {
  fileutil.load_file(filename, function(jsonObj) {
      var inserts = loader.loadJSON({
        path: path.dirname(filename)
      , name: path.basename(filename)
      , json: jsonObj
      , state: []
      })
      var size_of_inserts = _.size(inserts)
      if (size_of_inserts == 1) {
        console.log(filename)
        console.log("header",header)
        console.log("Size of json array:", jsonObj.length, "Size of inserts: ",size_of_inserts)
      }
//      if (false) {
      if (size_of_inserts != 0) {
        collection.insert(inserts, {w: 1}, function(err, records){
		      if (records) {
		       console.log(err)
           console.log(records.length, "records saved")
          } else {
            console.log("0 records saved")
          }
          callback()
		    })
		  } else {
		    callback()
		  }
  })
}

function all_done() {
  database.close()
}

// Connect to the db
var database
var collection
MongoClient.connect("mongodb://localhost:27017/massedu", function(err, db) {
	if(err) { return console.dir(err); }
  database = db
	collection = db.collection('org_code')
	
  fileutil.filelist({
    dir: walk_path
  , extname: '.csv'
  }, function(filelist) {
    async.eachSeries(filelist, one_file, all_done)
  })
})



