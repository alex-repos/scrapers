//authorRecordings.js
var cheerio = require('cheerio')
  , _ = require('lodash')
  ;

function authorRecordings(html) {
  var $ = cheerio.load(html)
    , link
    , recordingsList = []
    , titleAndLength
    , length
    , title
    , download
    , reading
    , timeRegex = /\(([0-9]+:)?[0-9]+?:[0-9]+?\)/g
    ;

  $('#content').find('a').each(function(i, el){
    link = $(this);

    if (link.text().toLowerCase() === 'mp3' && link.parent().is('li')) {
      titleAndLength = link.parent().text().replace(/:\s*MP3/g, '');
      title = titleAndLength.replace(timeRegex, '').trim();
      length = titleAndLength.match(timeRegex);
      download = link.attr('href');

      if (length && length.length > 0) {
        length = length[0].replace(/\(/g, '').replace(/\)/g, '');
      }
      else {
        length = undefined;
      }

      // The h2's are wrapped in links with a name attr
      if (link.parent().parent().prev().is('h2')) {
        reading = link.parent().parent().prev('h2').text();      
      }
      else {
        reading = 'Misc.'
      }

      recordingsList.push({"title" : title, "link" : download, "recording" : reading, "length": length});
    }
  });

  return recordingsList;
}

module.exports = authorRecordings;