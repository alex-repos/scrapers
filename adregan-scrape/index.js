var scrapeHTML = require('./scrape/scrape')
  , createAuthorList = require('./authorList/authorPennLink')
  , authorRecordings = require('./authorList/authorRecordings')
  ;

// scrapeHTML('http://writing.upenn.edu/pennsound/x/authors.php')
//   .then(createAuthorList)
//   .done(function(authors){
//     console.log(authors);
//   });


scrapeHTML('http://writing.upenn.edu/pennsound/x/Olson.php')
  .then(authorRecordings)
  .done(function(recordings){
    console.log(recordings);
  });

