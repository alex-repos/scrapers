#Scraperbelt.js
##Scraping toolkit for Node.js

Scraperbelt.js is an open-source toolbelt containing utilities for screen-scraping in Node.js, it's goal is to facilitate common
scraping tasks.

##Current status
Scraperbelt.js is currently a work in progress, right now it consists in very few (but useful) tools for scraping.

## What is it useful for?
Drying the request building process and DOM parsing.

## Documentation
You can find the complete annotated source [here](http://Narzerus.github.io/scraperbelt)

## Usage
Scraperbelt.js can be easily installed via `npm`:
```
npm install scraperbelt
```
Requiring and instancing:
```javascript
var Scraperbelt = require('scraperbelt');
var sb = new Scraperbelt();
```
If you are using [mikeal's Request](https://github.com/mikeal/request) then Scraperbelt's **options template builder** is
just what you need. This utility can be found under the `sb.http` namespace.

Getting an options object
```javascript
var http = require('request');

var opts = sb.http.options();
// Returns:
//
//  {
//    followRedirect: true,
//    headers: {
//      'User-Agent': '',
//      Connection: 'Keep-Alive',
//      'Accept-Encoding': 'gzip,deflate',
//      'Cache-Control': 'no-cache'
//    }
//  }

// Set request url
opts.url = 'http://www.google.com';

// Ready to go
http.get(opts, function(err, res, body){
  // ... //
});
```
*By default `sb.http.options()` will return an options object with the attributes displayed above*

Modifying our template object:
```javascript
// Modify some fields on the current template
sb.http.options({followRedirect: false, headers: {'User-Agent': 'Foo', 'Something': 'Bar' }});

// Retrieve our options object
sb.http.options();

// Returns:
//
//  {
//    followRedirect: false,
//    headers: {
//      'User-Agent': 'Foo',
//      Connection: 'Keep-Alive',
//      'Accept-Encoding': 'gzip,deflate',
//      'Cache-Control': 'no-cache',
//      'Something': 'Bar'
//    }
//  }
```
*When passing an object to `sb.http.options` the current template is merged with the
attributes of the object passed.*

Replacing our template object:
```javascript
var myTemplate = {
  followRedirect: true,
  headers: {
    'User-Agent': 'Bobby Jackson',
    'Accept-Encoding': 'gzip,deflate'
  }
  form: {
    'user': 'mrFoo',
    'password': 'Barman'
  }
}

// Replace template
sb.http.options(myTemplate, true);

// Get current template
var opts = sb.http.options();

// Returns:
//
//  {
//    followRedirect: true,
//    headers: {
//      'User-Agent': 'Bobby Jackson',
//      'Accept-Encoding': 'gzip,deflate'
//    }
//    form: {
//      'user': 'mrFoo',
//      'password': 'Barman'
//    }
//  }
```
*In the previous example we are adding a second parameter to `sb.http.options()` which specifies if the current
template should be overwritten.*

Restarting our template:
```javascript
    var myTemplate = {'we': 'messed up'};

    sb.http.options(myTemplate);

    sb.http.options();
    // Returns overwritten template:
    //
    // {'we', 'messed up'}

    // Reset template to default
    sb.http.options(null);

    sb.http.options();

    // Returns default template again:
    //
    //  {
    //    followRedirect: true,
    //    headers: {
    //      'User-Agent': '',
    //      Connection: 'Keep-Alive',
    //      'Accept-Encoding': 'gzip,deflate',
    //      'Cache-Control': 'no-cache'
    //    }
    //  }
```
Another cool feature is **parsing javascript from the dom**. You see, sometimes
you will need variables that are declared inside a `<script>` tag, which forces
you to do string handling. To avoid this you can use `sb.dom.getJsVars` (yes,
name could change), this method can receive a `jQuery` object or a simple string and returns an
object with all the variables declared inside the `<script>` tag (except ones declared inside functions for now).
```javascript
var $jsTag = $('script');
var variables = sb.dom.getJsVars($jsTag);
```
You can also use `sb.dom.formToObject` to get a form's data ready to be used in an http request.
The method receives a `jQuery` object or a simple string and returns an object.
```javascript
var $form = $('form#myForm');
var formBody = sb.dom.formToObject($form);
var opts = sb.http.options();
formBody.foo = 3;
opts.form = formBody;
http.post(opts, callback);
```

##Contribute
Feel free to submit your ideas, fixes, requests and enhancements.


##Current status
Stable, under development and accepting pull-requests

##About the author
My name is Rafael Vidaurre, I'm building a little page about myself you can find [here](http://www.rafaelvidaurre.com). Drop me a line
at **narzerus@gmail.com**
