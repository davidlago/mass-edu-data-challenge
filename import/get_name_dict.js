var fs = require('fs')
var path = require("path")
var _ = require('underscore')

var file1 = path.normalize(__dirname + '/org_name_schools.json')
var file2 = path.normalize(__dirname + '/org_name_districts.json')
var file3 = path.normalize(__dirname + '/org_name_non.json')

var dict1
var dict2
var dict3

exports.name_dict = function() {
  dict1 = JSON.parse(fs.readFileSync(file1, 'utf8'))
  dict2 = JSON.parse(fs.readFileSync(file2, 'utf8'))
  dict3 = JSON.parse(fs.readFileSync(file3, 'utf8'))
  console.log(_.size(dict1), _.size(dict2), _.size(dict3))
  _.extend(dict1, dict2)
  _.extend(dict1, dict3)
  console.log(_.size(dict1))
  return dict1
}

