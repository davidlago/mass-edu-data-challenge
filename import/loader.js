var fs  = require("fs")
var path = require("path")

exports.loadJSON = function (options) {

	var obj = JSON.parse(fs.readFileSync(options.path, 'utf8'))

	for (var index in obj) {

		var element = obj[index]
		var base = {}
		base.ORG_CODE = element.ORG_CODE
		base[options.folder] = {}
		var filename = path.basename(options.path, '.json')
		base[options.folder][filename] = element




		var exists = false;
		options.collection.findOne({ORG_CODE: base.ORG_CODE}, function(err, document) {
			if(!err) {
				exists = true;
			}
		});

		if(exists) {  // ORG_CODE/folder/filename already exists, use array


		} else { // Insert new one

			

		}


		console.log(base)

	}

}