var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient

app.use(bodyParser());

var port = process.env.PORT || 3000;
var dburl = process.env.DB_URL || "mongodb://localhos:27017/massedu";

var router = express.Router();

router.route('/:org_code').get(function(req, res) {
	MongoClient.connect(dburl, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('org_code')

		var realm = req.query.realm
		var year = req.query.year
		var query = {}
		query.org_code = req.params.org_code

		console.log('=====> New query for org_code ' + req.params.org_code)

		if(realm) {
			console.log('Querying for realm ' + realm)
			query[realm] = {$exists: true}
		}
		if(year) {
			console.log('Querying for year ' + year)
			query.year = year
		}

		collection.findOne(query, function(err, document) {
			if(err) // General error
				res.send(500)
			else if (!document) // Not found
				res.send(404)
		  	else // Everything OK, send result
		  		res.json(document)
		});
		
	});
});

app.use('/', router);

app.listen(port);
console.log('Listening on port ' + port);