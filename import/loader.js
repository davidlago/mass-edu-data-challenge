var fs  = require("fs")
var path = require("path")
var _ = require('underscore');

exports.loadJSON = function (options) {

	var obj = options.json;
	var intObj = [];
	var finalObj = [];

	var filename = options.fileroot;
	

	var grpORG = _.groupBy(obj, function(el){ return el.ORG_CODE; });

	for (var index in grpORG) {

		var item = grpORG[index];		
		var tempObj = {};
		tempObj.ORG_CODE = item[0].ORG_CODE;
		tempObj[options.folder] = {}
		tempObj[options.folder][filename] = item
		intObj.push(tempObj);

	}

	intObj = _.union(intObj,options.state)

	var grpORGT = _.groupBy(intObj, function(el){ return el.ORG_CODE; });
	for (var indexT in grpORGT) {
		var insides = grpORGT[indexT];
		
		var insGrp = _.groupBy(insides, function(el){ 

			var myFolder = '';
			for (var index in el) {
				myFolder = index;
			}
			return myFolder;
		});

		var insElem = {};
		insElem.ORG_CODE = insides[0].ORG_CODE

		
		for(var attributename in insGrp){

			insElem[attributename] = {}

			for(var i=0; i<insGrp[attributename].length; i++) {
				var tempEl = insGrp[attributename][i];
				
				for(var attributenameT in tempEl[attributename]){
					if(attributenameT != 'ORG_CODE') {
						insElem[attributename][attributenameT] = 
							tempEl[attributename][attributenameT]

					}
						


				}


			}
		}

		finalObj.push(insElem)
		

	}

	return finalObj;

}