var fs = require('fs')
var walk = require('walk')
var _ = require("underscore")
var path = require("path")

var walk_options = {
  followLinks: false
  // directories with these keys will be skipped
, filters: ["Temp", "_Temp", ".git", "node_modules"]
}

exports.filelist = function(options, callback) {

  var walker = walk.walk(options.dir, walk_options)

  var files = []

  walker.on("file", function (root, fileStats, next) {
    if (path.extname(fileStats.name) == options.extname) {
      var file = path.normalize(root+"/"+fileStats.name)
      files.push(file)
    }
    next()
  })

  walker.on("end", function() {
    callback(files)
  })
  
  walker.on("errors", function (root, nodeStatsArray, next) {
    console.log("error")
    next();
  })
}

exports.separator = function(filename) {
  var test_input = fs.openSync(filename, "r")
  var chunk = new Buffer(80)
  var number_read = fs.readSync(test_input,chunk,0,80,0)
  fs.close(test_input)
  var separator = ',' 
  if (chunk.toString().indexOf('\t') != -1) { separator = '\t' }
  return separator
}

