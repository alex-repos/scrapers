//authorPennLink.js

var cheerio = require('cheerio')
  , _ = require('lodash')
  ;

function authorPennLink(html){
  var $ = cheerio.load(html)
    , authors = []
    , author
    , authorName
    , authorLink
    , fullAuthorLink
    , siteContent
    ;

  $('#authors').find('a').each(function(i, el){
    author = $(this);
    authorName = author.text();
    authorLink = author.attr('href');

    authors.push({"author": authorName, "pennLink": makeAuthorLink(authorLink)});
  });

  return authors;
}

function makeAuthorLink(authorLink){
  var fullAuthorLink;

  if (authorLink.indexOf('http') === -1) {
    fullAuthorLink = 'http://writing.upenn.edu/pennsound/x/' + authorLink;
  }
  else {
    fullAuthorLink = authorLink;
  }
  
  return fullAuthorLink;
}

module.exports = authorPennLink;