Job Scraper
==========

The current build looks at local html files which are copies of job sites for local school districts. The getJobs.js file has a method called "updateJobs" which uses request to hit all of the provided html files and stores the HTML in a "responses" array.

Cheerio is used to add jquery-like selecting of those responses to store job data in mongodb.

### Start

run `npm start`

_note: you will see the server hit the local html files and write out a comment stating new jobs were found with a time_

If the server is left running, updateJobs will run every 24 hours and only add new jobs if found. Jobs that are removed will be given a { active: false } attribute.

more to come...
