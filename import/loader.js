var fs  = require('fs')
var path = require('path')
var _ = require('underscore')

exports.loadJSON = function (options) {

	var obj = options.json 				// New input file as a JSON
	var intObj = []						// Intermediate object, built from input JSON
	var finalObj = []					// Final object, mergin intermediate object and previous state object
	var filename = options.fileroot		// Input file name (without extension)
	
	// Group input document by ORG_CODE
	var grpORG = _.groupBy(obj, function(el){ return el.ORG_CODE })

	// Format the insides of the intermediate object for each grouped ORG_CODE element
	for (var index in grpORG) {
		var item = grpORG[index]		
		var tempObj = {}
		tempObj.ORG_CODE = item[0].ORG_CODE
		tempObj[options.folder] = {}
		tempObj[options.folder][filename] = item
		intObj.push(tempObj)
	}

	// Merge with previous state document
	intObj = _.union(intObj,options.state)

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

}