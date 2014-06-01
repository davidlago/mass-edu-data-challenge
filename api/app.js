var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient

app.use(bodyParser());

var port = process.env.PORT || 3000;

var router = express.Router();

router.route('/:org_code').get(function(req, res) {
	MongoClient.connect("mongodb://massedu.davidlago.us:27017/massedu", function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('org_code')

		var realm = req.query.realm
		var year = req.query.year
		var query = {}
		query.ORG_CODE = req.params.org_code

		console.log('=====> New query for ORG_CODE ' + req.params.org_code)

		if(realm) {
			console.log('Querying for realm ' + realm)
			//...
		}
		if(year) {
			console.log('Querying for year ' + year)
			//...
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