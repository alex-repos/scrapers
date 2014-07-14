// Web scraper inspired by Adnan Kukic tutorial on Scotch.io
// Originally used to scrape movie info from web and save as JSON
// Am in process of modifying file to address my programming goals


var express = require('express'),
    fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app     = express(),
    // URL to scrape 
    url     = 'http://hotlava.io/';
  
app.get('/scrape', function(req, res){
  
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.header').filter(function(){
            var data = $(this);
            title = data.children().first().text();
            release = data.children().last().children().text();

            json.title = title;
            json.release = release;
          })

          $('.div').filter(function(){
            var data = $(this);
            rating = data.text();

            json.rating = rating;
          })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
  })
})

app.listen('1337')
console.log('Magic happens on port 1337');
exports = module.exports = app; 
