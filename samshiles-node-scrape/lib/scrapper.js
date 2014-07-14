var cheerio = require('cheerio');
var request = require('request');

var Scrapper = function(url, pattern){
	var self = this;
	
	self.get = function(callback){
		request.get(url, function(error, response, body){
			$ = cheerio.load(body);	
			callback($(pattern));
		});
	}
}

module.exports = Scrapper;