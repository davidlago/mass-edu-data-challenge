//var fs = require('fs')
var walk = require('walk')

var loader = require('./loader')

var options = {
  followLinks: false
  // directories with these keys will be skipped
, filters: ["Temp", "_Temp", ".git", "node_modules"]
};

exports.walk_and_load = function(collection) {

  console.log("walk_and_load")
  var walker = walk.walk(__dirname+"\\..\\data", options)

  walker.on("file", function (path, fileStats, next) {
    console.log(path, fileStats.name)
    var tail = fileStats.name.substring(fileStats.name.length-5,fileStats.name.length)
    console.log(tail)
    if (tail == ".json") {
      var folder = path.split("/")
      console.log(folder[folder.length-1], path+"/"+fileStats.name)
    
      loader.loadJSON({
        folder: folder
      , filename: path+'/'+fileStats.name
      , collection: collection
      })
      next()
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

