var fs  = require('fs')
var path = require('path')
var _ = require('underscore')

function get_org_code(el) {
  var dist_code = el.DIST_CODE || "" // 8 digit
  var school = el.SCHOOL || "" // 8 digit
  if (school == "") { school = dist_code }
  var org_code = el.ORG_CODE || el.SCHOOL_CODE || el.DIST_SCHOOL_CODE ||(el.DISTRICT_CODE+"0000") || school
  return org_code
}

function get_year(el) {
  // The different files have many different year fields
  var year = el.FY_CODE || el.REC_YEAR || el.ORG_FY || el.GRADUATING_YEAR || el.YEAR || el.SY || el.FY || fileroot_year
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
  //var fileroot = options.filename.split(".csv")[0].split("data")[1]
  var fileroot = options.fileroot
  // Grab year
  var fileroot_year = fileroot.replace(/[^0-9]*([12][90][8901][0-9])[^0-9]*/,"$1")
  // Edit out years
  var fileroot_yearless = fileroot.replace(/(^|_)([12][90][8901][0-9](_|$))+/,"")
  // Edit out types of records (it's encoded in ORG_CODE)
  // 00000000 - Whole Mass.
  // nnnn0000 - District
  // nnnnnnnn - School
  var fileroot = fileroot_yearless.replace(/((_state)|(_district)|(_school))+/,"")
  // replace spaces with underscores
  var fileroot = fileroot.replace(/ /g,"_")
  // replace multipule underscores with a single one
  var fileroot = fileroot.replace(/__/g,"_")
  console.log("fileroot:",fileroot)

	// Group input document by ORG_CODE
	//var grpORG = _.groupBy(obj, function(el){ return el.ORG_CODE })

	// Format the insides of the intermediate object for each grouped ORG_CODE element
	//for (var index in grpORG) {
	//	var item = grpORG[index]		
	//	var tempObj = {}
	//	tempObj.ORG_CODE = item[0].ORG_CODE
	//	tempObj[options.folder] = {}
	//	tempObj[options.folder][filename] = item
	//	intObj.push(tempObj)
	//}
	var folder = options.folder.split(/[\/\\]data[\/\\]/)[1]
  console.log("folder/realm:", folder)
	
  // build insert records
  console.log("obj length", obj.length)
  //console.log(obj[0])
  var first = true

	// Group merged document by org_code and year
	var grpOrg = _.groupBy(obj, function(el){
	  return (get_org_code(el)+":"+get_year(el))
	})
  
  var intObj = _.map(grpOrg, function(records, org_code_and_year) {
    var org_code = org_code_and_year.split(":")[0]
    var year = org_code_and_year.split(":")[1]
    var to_insert = {
		  org_code: org_code
		, year: year
		, realm: folder
    }
    to_insert[fileroot] = records
    return to_insert
  })
  console.log("obj out size:",intObj.length)
  //if (intObj.length) {
  //  console.log(intObj[0].org_code, intObj[0].year, intObj[0].realm)
  //  _.map(intObj[0], function(val, key) {
  //    console.log(key, val[0])
  //  })
  //}

	// Merge with previous state document
	intObj = _.union(intObj,options.state)
  return intObj
  
	/*

	// Group merged document by ORG_CODE again
	var grpORGT = _.groupBy(intObj, function(el){ return el.ORG_CODE })
	
	// For each final grouped ORG_CODE, further group by folder name
	for (var indexT in grpORGT) {
		
		var insides = grpORGT[indexT]
		var insGrp = _.groupBy(insides, function(el){ 
			var myFolder = ''
			for (var index in el) {
				myFolder = index
			}
			return myFolder
		})

		var insElem = {}
		insElem.ORG_CODE = insides[0].ORG_CODE

		// For each grouped folder, fill insides of the document
		for(var attributename in insGrp){

			insElem[attributename] = {}
			
			for(var i=0; i<insGrp[attributename].length; i++) {
				
				var tempEl = insGrp[attributename][i]
				
				for(var attributenameT in tempEl[attributename]){
					if(attributenameT != 'ORG_CODE') {
						insElem[attributename][attributenameT] = 
							tempEl[attributename][attributenameT]

					}
				}
			}
		}

		// Add main, aggregated ORG_CODE object to final document
		finalObj.push(insElem)
	}
	// Return final document
	return finalObj
	*/

}