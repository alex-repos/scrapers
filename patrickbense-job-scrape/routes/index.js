var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var db = req.db;
	db.collection('jobs').find().sort({ "date": -1 }).toArray(function (err, jobs) {
		if (err) throw err;

		res.render('index', { title: 'testing', jobs: jobs }); // send in data here!
	});
});

module.exports = router;