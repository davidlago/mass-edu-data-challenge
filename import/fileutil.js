var fs = require('fs')
var split = require('split')
var walk = require('walk')
var _ = require("underscore")
var path = require("path")
var csv = require("./csv")

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

exports.tab_splitter = function(line) {
  return line.split('\t')
}
// On spec for test
//exports.reverse_tab_splitter = function(array) {
//  return line.join('\t')
//}

// return line to record translator (splitter)
exports.likely_splitter = function(line) {
  var csv_splitted = csv.parse(line)
  var tab_splitted = exports.tab_splitter(line)
  // Heristic, if there are tabs at all, and it's two or more, assume tab seporated
  if (tab_splitted >= 3) {
    return exports.tab_splitter
  } else {
    return csv.parse
  }
}

exports.fields_full = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (array.length == 0) {
      return false
    }
  }
  return true
}

exports.headlines = function(filename, callback) {
  var file_index = 0
  var line_number = 0
  var max_lines = 5
  var lines = []
  fs.createReadStream(filename)
    .pipe(split())
    .on('data', function (line) {
      if (line_number < max_lines) {
        line_number = line_number + 1
        lines.push(line)
      }
    })
    .on('end', function() {
      callback(lines)
    })
}

exports.line_parse = function(lines) {
  //return csv.parse(lines[0])
  var t_0 = lines[0].split('\t')
  var c_0 = csv.parse(lines[0])
  var line_0
  var line_1
  var line_2
  //console.log(c_0)
  if (t_0.length > c_0.length) {
    line_0 = t_0
    line_1 = lines[1].split('\t')
    line_2 = lines[2].split('\t')
    line_3 = lines[3].split('\t')
  } else {
    line_0 = c_0
    line_1 = csv.parse(lines[1])
    line_2 = csv.parse(lines[2])
    line_3 = csv.parse(lines[3])
  }
  
  if (line_0.length != line_1.length) {
    //console.log(lines)
    //console.log(line_0,line_1)
    throw new Error("Inconsistant number of fields")
  }
  if (line_0.length != line_2.length) {
    //console.log(lines)
    //console.log(line_0,line_2)
    throw new Error("Inconsistant number of fields")
  }
  if (line_0[line_0.length-1].length == 0) {
    if (line_1[line_1.length-1].length == 0) {
      if (line_2[line_2.length-1].length == 0) {
        //console.log(line_0)
        //console.log(line_1)
        //console.log(line_2)
        return line_3 // TODO fail!
        //throw new Error("Last field name zero length")
        
      } else {
        return line_2
      }
    } else {
      return line_1
    }
  }
  return line_0
}

exports.header_parse = function(filename, callback) {
  exports.headlines(filename, function(lines) {
    var fields = exports.line_parse(lines)
    callback({
      fields: fields
    })
  })
}


