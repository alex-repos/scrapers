var request = require('request'),
    cheerio = require('cheerio');

/* this file does all the work to fill the job postings */

/* list of schools to search through */
var schools = [
	// { name: 'Centennial', url: 'https://centennialpa.cloud.talentedk12.com/hire/index.aspx'},
	// { name: 'Central Bucks', url: 'https://apply.cbsd.org/index.aspx'},
	// { name: 'Neshaminy', url: 'https://neshaminypa.cloud.talentedk12.com/hire/index.aspx'},
	// { name: 'New Hope-Solebury', url: 'https://newhope.cloud.talentedk12.com/hire/index.aspx' },
	// { name: 'Wissahickon', url: 'https://wissahickon.cloud.talentedk12.com/hire/index.aspx'},
	// { name: 'Hatboro-Horsham', url: 'https://hatborohorsham.cloud.talentedk12.com/hire/index.aspx'}
	{ name: 'Centennial', url: 'http://localhost:3000/centennialtest.html'},
	{ name: 'Central Bucks', url: 'http://localhost:3000/centralbuckstest.html'},
	{ name: 'Neshaminy', url: 'http://localhost:3000/neshaminytest.html'},
	{ name: 'New Hope-Solebury', url: 'http://localhost:3000/newhopetest.html'},
	{ name: 'Wissahickon', url: 'http://localhost:3000/wissahickontest.html'},
	{ name: 'Hatboro-Horsham', url: 'http://localhost:3000/hatborohorshamtest.html'}
];

var responses = [];

function updateJobs (db, refreshPage) {
	"use strict";

	responses = []; // clear array if it already has contents
	// todo: drop previous collection
	var completeRequests = function (callback) {
		var completed = 0; // # of requests completed

		// rebuild collection
		for (var i = 0; i < schools.length; i++) {
			request(schools[i].url, function (err, res, html) {
				if (!err && res.statusCode == 200) {
					responses.push(html);

					completed++;
				} else {
					console.log(err);
				}

				// check if all are completed, if so callback to send request to browser
				if (completed === schools.length) {
					callback(responses);
				}
			});
		}
	};

	completeRequests(function () {
		// do work?!
		var newObj = [];
		var currentJob = 0;

		for (var i = 0; i < responses.length; i++) { // runs per district
			var $ = cheerio.load(responses[i]);

			var jobCount = $('#divJobs tr').length - 1; // todo: doesnt take into account multiple pages yet

			for (var j = 0; j < jobCount; j++) { // runs per job
				var $selector = $('#divJobs tr:nth-child(' + (2+j) + ')');
				newObj.push({ _id: { job: '', link: '' }, district: '', date: '', type: '', location: '', active: true });

				newObj[currentJob].district = schools[i]['name']; // district name
				newObj[currentJob]._id.job = $selector.find('td a').first().text(); // job name

				var startUrl = schools[i].url.substring(0, schools[i].url.lastIndexOf('/'));
				newObj[currentJob]._id.link = startUrl + '/' + $selector.find('td a').first().attr('href'); // job link

				newObj[currentJob].date = new Date($selector.find('td:nth-child(2)').first().text()); // post date
				newObj[currentJob].type = $selector.find('td:nth-child(3)').first().text(); // type
				newObj[currentJob].location = $selector.find('td:nth-child(4)').first().text(); // location

				currentJob++;
			}
		}

		// insert into DB
		db.collection('jobs').update({}, { $set: { "active": false }}, { multi: true }, function (err, doc) {
			// set all to inactive
		});

		for (var i = 0; i < newObj.length; i++) {
			db.collection('jobs').save(newObj[i], function (err, doc) {
				// inserted document
			});
		}

		// done
		refreshPage();
	});
}

module.exports.updateJobs = updateJobs;