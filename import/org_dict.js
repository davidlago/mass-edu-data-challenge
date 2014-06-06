var fs = require('fs')
var walker = require('./walker')
var _ = require('underscore')
var async = require('async')
var split = require('split')
var title = require('./title_case')

var org_code_fields = ['SCHOOL', 'DIST_CODE', 'ORG_CODE', 'SCHOOL_CODE', 'DIST_SCHOOL_CODE', 'DISTRICT_CODE', '"District Code"', 'org_code', 'Org_code']
var org_name_fields = ['ORG_NAME', 'DISTRICT_NAME', 'DISTRICT', 'SCHOOL_NAME', 'WPI_ORG_NAME', 'SchoolName', '"District Name"', 'DistrictName', '"DISTRICT NAME"', 'DIST_NAME']

var find_field_index = function(fields, header) {
  return _.indexOf(header,_.find(fields, function(f) { return _.indexOf(header, f) != -1 }))
}

function one_file(filename,callback) {
  var separator = walker.separator(filename)
  var lines = 0
  var header
  var org_code_index
  var org_name_index
  fs.createReadStream(filename)
    .pipe(split())
    .on('data', function (line) {
      if (lines == 0) {
        header = line.split(separator)
        //console.log(header)
        org_code_index = find_field_index(org_code_fields, header)
        org_name_index = find_field_index(org_name_fields, header)
        //console.log("*start*",filename)
        console.log(org_code_index, org_name_index)
        if ((org_code_index == -1) || (org_name_index == -1)) {
          console.log(line, JSON.stringify(separator))
        }
      } else {
        var fields = line.split(separator)
        //console.log(fields[1], fields[2])
        if (fields[org_code_index] && fields[org_name_index]) {
          if (org_dict[fields[org_code_index]]) {
            var new_name = title.toTitleCase(fields[org_name_index].replace(/"/g,"").trim())
            var old_name = org_dict[fields[org_code_index]]
            if (new_name.length > old_name.length) {
              org_dict[fields[org_code_index]] = new_name
            }
          } else {
            org_dict[fields[org_code_index]] = title.toTitleCase(fields[org_name_index].replace(/"/g,"").trim())
          }
        }
      }
      lines = lines + 1
      })
    .on('end', function() {
      //console.log(JSON.stringify(org_dict))
      console.log(_.size(org_dict))
      //console.log("*finish*",filename)
      callback()
    })
}

function all_done() {
  console.log(_.size(org_dict))
  fs.writeFileSync('org_dict.json',JSON.stringify(org_dict))
  console.log("--done--")
}

var org_dict = {}
walker.filelist({ dirBase: '../data' }, function(filelist) {
  async.eachSeries(filelist, one_file, all_done)
})
