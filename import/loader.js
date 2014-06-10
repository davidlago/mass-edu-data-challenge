var fs  = require('fs')
var path = require('path')
var _ = require('underscore')
var get_name_dict = require('./get_name_dict')

var name_dict = get_name_dict.name_dict()

function get_org_code(el) {
  var org_code = el.SCHOOL || el.SCHOOL_CODE || el.DIST_CODE || el.ORG_CODE || el.org_code || el.Org_code || el.DIST_SCHOOL_CODE || el["Org Code"] || el["District Code"] ||(el.DISTRICT_CODE+"0000")
  return org_code
}

function get_year(el, fileroot_year) {
  // The different files have many different year fields
  var year = el.FY_CODE || el.REC_YEAR || el.ORG_FY || el.GRADUATING_YEAR || el.YEAR || el.SY || el.FY || el.Year || el.adminyear || fileroot_year
  var int_year = parseInt(year)
  // don't save record if there is no year
  if ((int_year < 1970) || (int_year > 2015)) {
    year = "NA"
  }
  return year
}

exports.loadJSON = function (options) {

	var obj = options.json 				// New input file as a JSON
	var intObj = []						// Intermediate object, built from input JSON
	var finalObj = []					// Final object, mergin intermediate object and previous state object

	//var filename = options.fileroot		// Input file name (without extension)
  //console.log(options)
  var fileroot = options.name.split(".csv")[0]
  // Grab year
  var fileroot_year = fileroot.replace(/[^0-9]*([12][90][8901][0-9])[^0-9]*/,"$1")
  //console.log(fileroot_year)
  // Edit out years
  var fileroot_yearless = fileroot.replace(/[12][90][8901][0-9]/g,"")
  // Edit out types of records (it's encoded in ORG_CODE)
  // 00000000 - Whole Mass.
  // nnnn0000 - District
  // nnnnnnnn - School
  fileroot = fileroot_yearless.replace(/((_state)|(_district)|(_school))+/,"")
  // replace spaces with underscores
  fileroot = fileroot.replace(/ /g,"_")
  // replace multipule underscores with a single one
  fileroot = fileroot.replace(/__/g,"_")
  fileroot = fileroot.replace(/__/g,"_")
  fileroot = fileroot.replace(/_$/,"")
  
  //console.log("fileroot:",fileroot)

	var folder = options.path.split(/[\/\\]data[\/\\]/)[1]
  //console.log("folder/realm:", folder)
	
  // build insert records
  //console.log("obj length", obj.length)
  //console.log(obj[0])
  var first = true

	// Group merged document by org_code and year
	var grpOrg = _.groupBy(obj, function(el){
	  return (get_org_code(el)+":"+get_year(el, fileroot_year))
	})
  var blat = 0
  var intObj = _.map(grpOrg, function(records, org_code_and_year) {
    var org_code = org_code_and_year.split(":")[0]
    var year = org_code_and_year.split(":")[1]
    var dist_code = org_code.substring(0,4)+"0000"
    var to_insert = {
		  org_code: org_code
		, org_name: name_dict[org_code]
		, dist_code: dist_code
		, dist_name: name_dict[dist_code]
		, year: year
		, realm: folder
    }
    to_insert[fileroot] = records
    return to_insert
  })
  //console.log("obj out size:",intObj.length)

	// Merge with previous state document
	intObj = _.union(intObj,options.state)
  return intObj

}
