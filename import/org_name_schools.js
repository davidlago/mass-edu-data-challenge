// node org_name_schools.js > org_name_schools.json
var fs = require('fs')
var split = require('split')

var schools = "../data/educators_teachers/staffing_age_report_school_2011_2014.csv"

var org_dict = {}

var lines = 0

var header
fs.createReadStream(schools)
 .pipe(split())
 .on('data', function (line) {
   if (lines == 0) {
     header = line.split('\t')
   } else {
     var fields = line.split('\t')
     org_dict[fields[3]] = fields[4]
   }
   lines = lines + 1
 })
 .on('end', function() {
   console.log(JSON.stringify(org_dict))
 })

