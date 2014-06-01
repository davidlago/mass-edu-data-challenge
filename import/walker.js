var fs = require('fs')
var walk = require('walk')
var Converter=require("csvtojson").core.Converter
var _ = require("underscore")
var path = require("path")

var loader = require('./loader')

var options = {
  followLinks: false
  // directories with these keys will be skipped
, filters: ["Temp", "_Temp", ".git", "node_modules"]
};

var state =  []

exports.walk_and_load = function(options) {
  var dirBase = options.dirBase

  // Wipe out state
  state = [] 

  console.log("walk_and_load")
  var walk_path = path.normalize(__dirname+"/"+dirBase)
  console.log(walk_path)
  var walker = walk.walk(walk_path, options)

  walker.on("file", function (path, fileStats, next) {
    var tail = fileStats.name.substring(fileStats.name.length-4,fileStats.name.length)
    if (tail == ".csv") {
      var fileroot = fileStats.name.split(".csv")[0]

      parse_and_load({
        path: path
      , name: fileStats.name
      , collection: options.collection
      }, next)
      
    } else {
      next()
    }
  })

  walker.on("end", function() {
  })
  
  walker.on("errors", function (root, nodeStatsArray, next) {
    console.log("error")
    next();
  })
}

var param_tsv = {
    "constructResult": true, //set to false to not construct result in memory. suitable for big csv data
    "delimiter": "\t", // change the delimiter of csv columns
    "quote": "\"" //quote for a column containing delimiter.
}

function parse_and_load(options, next) {
  //console.log(options)
  var filename = options.path+"/"+options.name
  var test_input = fs.openSync(filename, "r")
  var chunk = new Buffer(80)
  var number_read = fs.readSync(test_input,chunk,0,80,0)
  fs.close(test_input)
  var param = { constructResult: true, delimiter: "," }
  if (chunk.toString().indexOf("\t") != -1) {
    //console.log("Tab!")
    param = param_tsv
  } else {
    //console.log("No tab")
    //console.log(chunk.toString())
  }
  var input = fs.createReadStream(filename, { encoding: 'utf8' })
  
  var converter=new Converter(param);

  //end_parsed will be emitted once parsing finished")
  converter.on("end_parsed",function(jsonObj){
    console.log(_.size(jsonObj)); //here is your result json object
    var inserts = loader.loadJSON({
        path: options.path
      , name: options.name
      , json: jsonObj
      , state: []
    })
    var size_of_inserts = _.size(inserts)
    console.log("Size of inserts: ",size_of_inserts)
    if (size_of_inserts != 0) {
      //options.collection.update(searchParm, {$set: insertParm}, {upsert:true}
      options.collection.insert(inserts, {w: 1}, function(err, records){
		    //console.log(err)
		    if (records) {
           console.log(records.length, "records saved")
        } else {
           console.log("0 records saved")
        }
        next()
		  })
		} else {
		  next()
		}
  });

  var x = 0
  converter.on("record_parsed",function(resultRow,rawRow,rowIndex){
    if (x < 0) {
      console.log(resultRow); //here is your result json object
      x = x + 1
    }
  });
  
  input.pipe(converter)
}

