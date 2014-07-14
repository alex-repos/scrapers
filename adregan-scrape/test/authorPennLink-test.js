var should = require('should')
  , authorPennLink = require('../authorList/authorPennLink')
  , html
  , object
  ;

html = '<div id="authors"><ul><li><a href="testname.html">Test Name</a></li><li><a href="testname2.html">Test Name 2</a></li></ul></div>';
object = [{"author": "Test Name", "pennLink": "http://writing.upenn.edu/pennsound/x/testname.html"}, {"author": "Test Name 2", "pennLink": "http://writing.upenn.edu/pennsound/x/testname2.html"}];

describe('authorArray', function() {
  describe('authorPennLink', function(){
    it('Should return an array of objects with an author\'s name and a link', function(){
      JSON.stringify(authorPennLink(html)).should.equal(JSON.stringify(object));
    })
  })
});