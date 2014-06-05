// node org_name_districts.js > org_name_districts.json
var fs = require('fs')
var split = require('split')

var districts = "../data/educators_teachers/staffing_age_report_state_district_2008_2014.csv"

var org_dict = {}

var lines = 0

var header
fs.createReadStream(districts)
 .pipe(split())
 .on('data', function (line) {
   if (lines == 0) {
     header = line.split('\t')
   } else {
     var fields = line.split('\t')
     org_dict[fields[1]] = fields[2]
   }
   lines = lines + 1
 })
 .on('end', function() {
   console.log(JSON.stringify(org_dict))
 })

