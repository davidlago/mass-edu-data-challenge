var fs  = require("fs");

exports.loadJSON = function (options) {

	var obj = JSON.parse(fs.readFileSync(path, 'utf8'));

	console.log(JSON.stringify(obj));




  	// var doc1 = {'hello':'doc1'};

  	// collection.insert(doc1, {w:1}, function(err, result) {

  	// if(err)
  	// 	console.log(err);
  	// else
  	// 	console.log('Done!');

};