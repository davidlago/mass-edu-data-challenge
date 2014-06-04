var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient

app.use(bodyParser());

var port = process.env.PORT || 3000;
var dburl = process.env.DB_URL || "mongodb://db.massedu.info:27017/massedu";

var router = express.Router();





MongoClient.connect(dburl, function(err, db) {
	if(err) { return console.dir(err); }

	var collection = db.collection('org_code')

	// Returns a list of schools
	router.route('/schools').get(function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		// Peform a simple group by on an empty collection
    	collection.group(['org_code','org_name'], {'org_code':{ $regex: '^((?!\\d{4}0000).)*$', $options: 'g' }}, {}, "function (obj, prev) {}", function(err, results) {
			if(err) // General error
				res.send(500)
			else if (!results) // Not found
				res.send(404)
		  	else // Everything OK, send result
		  		res.json(results)
		});

	}); // /schools


	// Returns a list of districts
	router.route('/districts').get(function(req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		// Peform a simple group by on an empty collection
    	collection.group(['org_code','org_name'], {'org_code':{ $regex: '\\d{4}0{4}', $options: 'g' }}, {}, "function (obj, prev) {}", function(err, results) {
			if(err) // General error
				res.send(500)
			else if (!results) // Not found
				res.send(404)
		  	else // Everything OK, send result
		  		res.json(results)
		});

	}); // /districts


	// Queries the documents by an organization code (school or district)
	router.route('/:org_code').get(function(req, res) {

		res.header("Access-Control-Allow-Origin", "*");

		var realm = req.query.realm
		var year = req.query.year
		var query = {}
		query.org_code = req.params.org_code

		console.log('=====> New query for org_code ' + req.params.org_code)

		if(realm) {
			console.log('Querying for realm ' + realm)
			//query[realm] = {$exists: true}

			

			var or1 = {}
			or1[realm] = {$exists: true}
			var or2 = {}
			or2.realm = realm
			query.$or = [or1,or2]


			// SAMPLE OR QUERY TERM:
			// {
			//   title:"MongoDB",
			//   $or:[
			//     {author:"Daniel"},
			//     {author:"Jessica"}
			//   ]
			// }
		}
		if(year) {
			console.log('Querying for year ' + year)
			query.year = year
		}

		collection.find(query).toArray(function(err, document) {
			if(err) // General error
				res.send(500)
			else if (!document) // Not found
				res.send(404)
		  	else // Everything OK, send result
		  		res.json(document)
		});
		
	}); // /:org_code


}); // MongoDB connection

app.use('/', router);

app.listen(port);
console.log('Listening on port ' + port);