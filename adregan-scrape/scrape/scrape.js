var fs = require('fs')
  , request = require('request')
  , Q = require('q')
  ;

function scrapeHTML(url) {
  var deferred = Q.defer();

  request(url, function(error, response, html){
    if (!error) {
      deferred.resolve(html);
    }
    else {
      deferred.reject(new Error(error));
    }
  });
  return deferred.promise;
}

module.exports = scrapeHTML;