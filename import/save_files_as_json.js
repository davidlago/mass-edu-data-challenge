// Required libs
var fs = require('fs')
var fileutil = require('./fileutil')
var path = require("path")
var async = require("async")
var field_index = require('./field_index')
var _ = require('underscore')

var walk_path = path.normalize(__dirname+"/"+"../data")

function one_soa_file(filename, callback) {
  fileutil.load_file(filename, function(json) {
    var years = []
    var org_ids = []
    console.log(json.length)
    var realm = path.dirname(filename).split('\\').pop()
    var file_root = path.basename(filename).split('.csv')[0]
    var soa = {}
    _.map(json[0], function(value, key) {
      soa[key]=[]
    })
    _.each(json, function(e) {
      _.map(e, function(value, key) {
        soa[key].push(value)
      })
    })
    
    fs.writeFile('../public/api/soa/'+realm+'/'+file_root+'.json',JSON.stringify(soa), function() {
      console.log("write succeeded")
    })
  })
}

function all_done() {
  console.log("all done")
}

function build_row_ids() {
  var years = JSON.parse(fs.readFileSync('year.json'))
  var org_ids = JSON.parse(fs.readFileSync('org_id.json'))
  var row_ids = []
  _.each(org_ids, function(o) {
    _.each(years, function(y) {
      row_ids.push(y+" "+o)
    })
  })
  assert(years.length*org_ids.length == row_ids.length)
  row_ids.sort()
  fs.writeFileSync('row_ids.json', JSON.stringify(row_ids))
  return row_ids
}


fileutil.filelist({
  dir: walk_path
, extname: '.csv'
}, function(filelist) {
})


