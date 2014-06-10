var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var async = require('async')
var split = require('split')
var title = require('./title_case')
var fileutil = require('./fileutil')
var field_index = require('./field_index')

var done = false
function one_file(filename,callback) {
  if (filename.match(/special_education_report_compliance_district_2006_2013/)) {
    done = true
  }
  if (done) {
    callback()
    return
  }
  var separator = fileutil.separator(filename)
  var lines = 0
  var header
  var org_code_index
  var org_name_index
  var year_index
  fs.createReadStream(filename)
    .pipe(split())
    .on('data', function (line) {
      if (lines == 0) {
        header = line.split(separator)
        //console.log(header)
        org_code_index = field_index.org_code(header)
        org_name_index = field_index.org_name(header)
        year_index = field_index.year(header)
        console.log(filename)
        //console.log(org_code_index, org_name_index)
        if ((org_code_index == -1) || (org_name_index == -1)) {
          //console.log(line, JSON.stringify(separator))
        }
      } else {
        var fields = line.split(separator)
        //console.log(fields[1], fields[2])
        if (fields[org_code_index] && fields[org_name_index]) {
          var new_year = parseInt(fields[year_index])
          if (org_dict[fields[org_code_index]]) {
            var new_name = title.toTitleCase(fields[org_name_index].replace(/"/g,"").trim())
            var old_name = org_dict[fields[org_code_index]]
            //if ((new_name.length > old_name.length) && ((!year_dict[fields[org_code_index]]) || (new_year <= year_dict[fields[org_code_index]]))) {
            if (new_year > year_dict[fields[org_code_index]]) {
              if (new_name.match(/^([A-Za-z\(\)\-]+ )+- /)) {
                if (new_name.match(/Fowler - Osborn/)) {
                  console.log("A",year_dict[fields[org_code_index]], new_year)
                  org_dict[fields[org_code_index]] = new_name
                  //console.log("Yes",old_name,":",new_name)
                } else {
                  //console.log("Not",old_name,":",new_name)
                }
              } else {
                console.log("B",year_dict[fields[org_code_index]], new_year)
                console.log(old_name,":",new_name)
                org_dict[fields[org_code_index]] = new_name
                year_dict[fields[org_code_index]] = new_year
              }
            }
          } else {
            org_dict[fields[org_code_index]] = title.toTitleCase(fields[org_name_index].replace(/"/g,"").trim())
            year_dict[fields[org_code_index]] = new_year
            console.log("C",year_dict[fields[org_code_index]], new_year)
          }
        }
      }
      lines = lines + 1
      })
    .on('end', function() {
      //console.log(JSON.stringify(org_dict))
      //console.log(_.size(org_dict))
      //console.log("*finish*",filename)
      _.each(org_dict, function(val, key) {
        // fix Elem
        val = val.replace(/Elem$/,"Elementary")
        // fix Sch
        val = val.replace(/Sch(\s|$)/,"School")
        // Ayers@mckay/Ryal Side Sch
        // Ayers/Ryal Side School
        val = val.replace(/Ayers@mckay/,"Ayers")
        // Eddy Elementary (02/97)
        val = val.replace(/ \(02\/97\)/,"")
        // Worcester Public School 2 : Worcester - Claremont Academy
        val = val.replace(/Worcester Public School 2/,"Claremont Academy")
        val = val.replace(/Worcester Public School 1/,"Woodland Academy")
        // Leroy E.mayo
        val = val.replace(/E\.mayo/,"E. Mayo")
      })
      callback()
    })
}

function all_done() {
  console.log(_.size(org_dict))
  fs.writeFileSync('org_dict.json',JSON.stringify(org_dict))
  console.log("--done--")
}

var walk_path = path.normalize(__dirname+"/"+"../data")

var org_dict = {}
var year_dict = {}
fileutil.filelist({
  dir: walk_path
, extname: '.csv'
}, function(filelist) {
  async.eachSeries(filelist, one_file, all_done)
})
