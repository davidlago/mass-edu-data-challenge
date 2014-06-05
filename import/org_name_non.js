// node org_name_non.js > org_name_non.json
var fs = require('fs')
var split = require('split')

var districts = "../data/students/non public school_report_district_2002_2012.csv"

function toTitleCase(original)
{
  //var str = original.replace(/\w\S*/g, function(txt){
  var str = original.replace(/([^\W_]+[^\s-/]*) */g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  var lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++) {
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt) {
      return txt.toLowerCase()
    })
  }

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv', 'Hs', 'Pk', 'Sda', 'Ii', 'Iii', 'Iv', 'Vi', 'Xxiii'];
  for (i = 0, j = uppers.length; i < j; i++) {
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase())
  }
  return str;
}

var org_dict = {}

var lines = 0

var header
fs.createReadStream(districts)
 .pipe(split())
 .on('data', function (line) {
   if (lines == 0) {
     header = line.split(/,/)
     //console.log(header)
   } else {
     var fields = line.split(/,/)
     if (fields[1]) {
       org_dict[fields[3]] = toTitleCase(fields[1].replace(/"/g,"").trim())
     }
     //if (lines < 8000) {
     //  console.log(fields[3], org_dict[fields[3]])
     //}
   }
   lines = lines + 1
 })
 .on('end', function() {
   console.log(JSON.stringify(org_dict))
 })

