// Required libs
var MongoClient = require('mongodb').MongoClient
var fileutil = require('./fileutil')
var walker = require('./walker')
var loader = require('./loader')
var fs = require("fs")
var split = require('split')
var path = require("path")
var async = require("async")
var csv = require("./csv")
var field_index = require('./field_index')
var _ = require('underscore')

//var get_name_dict = require('./get_name_dict')
//var name_dict = get_name_dict.name_dict()

var walk_path = path.normalize(__dirname+"/"+"../data")
var do_not_process = ["tools"]
// var do_not_process ["tools", "educators_teachers", "financial", "mcas", "students"]
function one_file(filename, callback) {
  var separator = fileutil.separator(filename)
  var field_splitter = csv.parse
  if (separator == '\t') {
    field_splitter = fileutil.tab_splitter
  } 
  var lines = 0
  var got_header = false
  var header
  var org_code_index
  var org_name_index
  var year_index
  var jsonObj = []
  fs.createReadStream(filename)
    .pipe(split())
    .on('data', function (line) {
      if (!got_header) {
        header = field_splitter(line)
        //console.log(header)
        org_code_index = field_index.org_code(header)
        org_name_index = field_index.org_name(header)
        year_index = field_index.year(header)
        if (org_code_index != -1) {
          got_header = true
        } else {
          // TODO lookup school name and insert by school name
          if (org_name_index != -1) {
            console.log("header", header)
          }
        }
        if (lines == 20) {
          console.log("Read 20 lines without finding header")
          console.log(filename)
          console.log("data",header)
        }
      } else {
        var fields = field_splitter(line)
        jsonObj.push(_.object(header,fields))
      }
      lines = lines + 1
    })
    .on('end', function() {
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



