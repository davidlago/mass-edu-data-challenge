// Required libs
var fs = require('fs')
var fileutil = require('./fileutil')
var path = require("path")
var async = require("async")
var field_index = require('./field_index')
var fileroot = require('./loader').fileroot
var _ = require('lodash')
var field_util = require('./field_util')

//
//  realm/subrealm/2014_school_fieldname.json
//  field_index.json
//

var is_district_code = function(code) { return code.match(/^[0-9]{4}(0000)?$/) }
var is_org_code = function(code) { return code.match(/^[0-9]{8}$/) }

var walk_path = path.normalize(__dirname+"/"+"../data")

function keys(json) {
  var keys = _.map(json[0], function(value, key) {
    return key
  })
  return keys
}

function aos_to_soa(json) {
  var soa = {}
  _.map(json[0], function(value, key) {
    soa[key]=[]
  })
  _.each(json, function(e) {
    _.map(e, function(value, key) {
      soa[key].push(value)
    })
  })
  return soa
}

function one_file_soa_fields(filename, callback) {
  fileutil.load_file(filename, function(json) {
    var years = []
    var org_ids = []
    console.log(json.length)
    var realm = path.dirname(filename).split('\\').pop()
    var root = fileroot(path.basename(filename))
    var subrealm = root.fileroot
    var soa = aos_to_soa(json)
    fs.mkdir('../public/api/soa/'+realm, "0755", function(err) {
    fs.mkdir('../public/api/soa/'+realm+'/'+subrealm, "0755", function(err) {
      _.map(soa, function(values, field) {
        var f = field.replace(/\//,"-or-")
        console.log(field, f)
        fs.writeFileSync('../public/api/soa/'+realm+'/'+subrealm+'/'+f+'.json',JSON.stringify(values))
      })
      callback()
    })
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
  //fs.writeFileSync('row_ids.json', JSON.stringify(row_ids))
  return row_ids
}


function one_soa_file(filename, callback) {
  fileutil.load_file(filename, function(json) {
    var years = []
    var org_ids = []
    console.log(json.length)
    var realm = path.dirname(filename).split('\\').pop()
    //var root = fileroot(path.basename(filename))
    //var subrealm = root.fileroot
    var f = path.basename(filename).split('.csv')[0]
    var soa = aos_to_soa(json)
    fs.mkdir('../public/api/soa/'+realm, "0755", function(err) {
      fs.writeFileSync('../public/api/soa/'+realm+'/'+f+'.json',JSON.stringify(soa))
      callback()
    })
  })
}

function code(row, indecies) {
  var result = row[indecies.school]
  if (!result || result == '') {
    result = row[indecies.district]
  }
  if (!result || result == '') {
    result = row[indecies.district_short]
    if (result) {
      result = result+'0000'
    }
  }
  if (!result || result == '') {
    console.log(row)
    console.log(indecies)
    process.exit(1)
  }
  return result
}

function one_aos_file(filename, callback) {
  fileutil.load_file(filename, function(json) {
    if (filename.indexOf("student_indicator_report") != -1) {
      console.log(filename)
      console.log(json[0],json[1])
      //process.exit(1)
    }
    //var indicies = field_util.find_columns(json)
    //if (indicies.school != -1 || indicies.district != -1 || indicies.district_short != -1 || indicies.state != -1) {
    //  var headers = field_util.find_headers(json)
    //} else {
    //  if (filename.indexOf("layout") == -1) {
    //    console.log("Non-layout file not processed: ", filename)
    //  }
    //}
//    var f = path.basename(filename).split('.csv')[0]
//    fs.mkdir('../public/api/aos/'+realm, "0755", function(err) {
//      fs.writeFileSync('../public/api/aos/'+realm+'/'+f+'.json',JSON.stringify(json))
      callback()
//    })
  })
}

/*
function one_aos_file(filename, callback) {
  fileutil.load_file(filename, function(json) {
    var years = []
    var org_ids = []
    var districts = []
    var schools = []
    var state = []
    for (var i = 0; i < json.length; i ++) {
      var rec = json[i]
      var school = rec.SCHOOL || ''
      var org_code = rec.ORG_CODE || ''
      if (is_org_code(school)) {
        if (is_district_code(school)) {
          if (school == "00000000") {
            state.push(rec)
          } else {
            districts.push(rec)
          }
        } else {
          schools.push(rec)
        }
      } else {
        if (is_district_code(org_code)) {
          if (org_code == "00000000") {
            state.push(rec)
          } else {
            districts.push(rec)
          }
        } else {
          console.log("Bad record:", rec)
          //process.exit(1)
        }
      }
    }
    console.log(json.length
    , state.length
    , districts.length
    , schools.length
    , state.length+districts.length+schools.length)
    var realm = path.dirname(filename).split('\\').pop()
    var f = path.basename(filename).split('.csv')[0]
    fs.mkdir('../public/api/aos/'+realm, "0755", function(err) {
      fs.writeFileSync('../public/api/aos/'+realm+'/'+f+'.json',JSON.stringify(json))
      callback()
    })
  })
}
*/

function group(filelist) {
  console.log(filelist.length)
  var result = {}
  _.each(filelist, function(filename) {
    var realm = path.dirname(filename).split('\\').pop()
    var root = fileroot(path.basename(filename))
    var subrealm = root.fileroot
    var key = realm+" "+subrealm
    result[key] = result[key] || []
    result[key].push(filename)
  })
  var result_too = _.map(result, function(value, key) {
    return {
      realm: key.split(' ')[0]
    , subrealm: key.split(' ')[1]
    , files: value
    }
  })
  console.log(result_too[0])
  return result_too
}

function load_group(group, data_callback) {
  var group_json = []
  async.eachSeries(group.files, function(filename, callback) {
    fileutil.load_file(filename, function(json) {
      group_json.push(json)
      callback()
    })
  }, function() {
    data_callback(group_json)
  })
}

function merge_group(group, soas, callback) {
  for (var i = 0; i < soas.length; i++) {
    var soa = soas[i]
    var filename = group.files[i]
    var fileroot_year = fileroot(filename).fileroot_year
    var fields = keys(soa)
    var year_index = field_index.year(fields)
    var org_code_index = field_index.org_code(fields)
    if (year_index == -1) {
      if (fileroot_year.match(/^((19[89][0-9])|(20[01][0-9]))$/)) {
        // good fileroot_year
      } else {
        // can't process file
        console.log(year_index, org_code_index, fields[year_index], fields[org_code_index], fileroot_year)
      }
    } else {
      // good year_index
    }
    
    // TODO Confirm column identity with regex
    // TODO Gather all headers in a header structure
    // TODO Find cross-reference data
    // TODO Automate process of cross-referencing
  }
  callback()
}

function write_fields(group, soa, callback) {
  callback()
}

function merge_write(filelist) {
  var grouplist = group(filelist)
  fs.mkdir('../public/api/soa', "0755", function(err) {
    async.eachSeries(grouplist, function(group, callback) {
      load_group(group, function(soas) {
        merge_group(group, soas, function(soa) {
          write_fields(group, soa, callback)
        })
      })
    }, function() { console.log("all done main") })
  })
}

function aos_files(filelist) {
  fs.mkdir('../public/api/aos', "0755", function(err) {
    async.eachSeries(filelist, function(filename, callback) {
      one_aos_file(filename, callback)
    }, function() { console.log("all done main") })
  })
}

function soa_fields(filelist) {
  fs.mkdir('../public/api/soa', "0755", function(err) {
    async.eachSeries(filelist, function(filename, callback) {
      one_file_soa_fields(filename, callback)
    }, function() { console.log("all done main") })
  })
}

function soa_files(filelist) {
  fs.mkdir('../public/api/soa', "0755", function(err) {
    async.eachSeries(filelist, function(filename, callback) {
      one_soa_file(filename, callback)
    }, function() { console.log("all done main") })
  })
}

fileutil.filelist({
  dir: walk_path
, extname: '.csv'
}, function(filelist) {
  // merge_write(filelist)
  // soa_fields(filelist)
  // soa_files(filelist)
  //var grouplist = group(filelist)
  //console.log(grouplist)
  aos_files(filelist)
})


