(function () {


  //     Scraperbelt.js 0.1
  //     http://www.rafaelvidaurre.com
  //     (c) 2013 Rafael Vidaurre
  //     Scraperbelt may be freely distributed under the MIT license.

  "use strict";

  var $ = require('jquery');
  var esprima = require('esprima');
  var check = require('validator').check;
  var sanitize = require('validator').sanitize;

  // Scraper Belt
  // ============
  // A toolbelt for web-scraping
  //

  var Sb = function () {
    this.dom = {};
    this.parse = this.dom;
    this.http = {};

    // Namespaces
    // ---------------------

    // Sb.parse = {}; // Dom parsing
    // Sb.http = {}; // HTTP request building



    // Dom Utilities
    // -------------

    // `parse.formToObject` converts a form jQuery element or plain text
    // into a Javascript Object
    this.parse.formToObject = function (elem) {
      var $elem;
      if (typeof(elem) == 'function' && elem instanceof 'jquery'){
        $elem = elem;
      } else {
        $elem = $(elem);
      }

      var fieldArray = $elem.serializeArray(); // Serialize object array
      var object = {}; // Formatted object to be returned

      // append elements to final object as key/value pairs
      $.each(fieldArray, function (idx, field) {
        object[field.name] = field.value;
      });

      return object;
    };

    // `parse.getJsVars` returns a JSON object containing all variables
    // defined inside a `<script>` tag jquery element by parsing javascript.
    this.parse.getJsVars = function (elem) {
      var getAstVariables = function (ast) {
        var object;

        switch (ast.type) {
        case "Program":

          object = {};
          $.each(ast.body, function (idx, declaration) {
            var resVar = getAstVariables(declaration);
            if (typeof(resVar) == 'object') {
              object[resVar.name] = resVar.value;
            }
          });

          return object;
        case "VariableDeclaration":

          if (ast.declarations.length > 1) {
            object = [];
            $.each(ast.declarations, function (idx, declaration) {
              object.push(getAstVariables(declaration));
            });
          } else {
            object = getAstVariables(ast.declarations[0]);
          }

          return object;
        case "VariableDeclarator":

          object = {};
          object.name = ast.id.name;
          object.value = getAstVariables(ast.init);

          return object;
        case "Literal":

          return ast.value;
        case "ArrayExpression":

          object = [];

          $.each(ast.elements, function (idx, elem) {
            object.push(getAstVariables(elem));
          });

          return object;
        case "FunctionExpression":

          // Variables inside functions are not parsed
          return "function";
        default:
          return object;
        }
      };
      var raw_javascript;
      if (typeof(elem) == 'function' && elem instanceof 'jquery'){
        raw_javascript = elem.text();
      } else {
        raw_javascript = elem;
      }

      var ast = esprima.parse(raw_javascript);

      return getAstVariables(ast);
    };

    // Tools for cleaning and processing data
    this.parse.sanitize = sanitize;
    // Tools to test parsed data
    this.parse.check = check;


    // HTTP Utilities
    // --------------

    this.http = new function () {

      // Default template
      var _defaultTemplate = {
        followRedirect: true,
        headers: {
          'User-Agent': '',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip,deflate',
          'Cache-Control': 'no-cache'
        }
      };

      // Initialize with default template
      var _template = $.extend(true, {}, _defaultTemplate);

      // `http.options` returns a template options object meant to be used
      // in HTTP requests with
      // [mikeal's request](https://github.com/mikeal/request).
      // `fields` is an object which extends the default template, if `overwrite`
      // is true, `fields` will completely replace the template.
      // To reset to the default template `null` must be passed
      // as the first argument
      this.options = function (fields, overwrite) {
        if (fields === undefined) {
          return $.extend(true, {}, _template);
        }

        if (fields === null) {
          _template = _defaultTemplate;
        }

        if (typeof fields !== 'object') {
          return $.extend(true, {}, _template);
        }

        if (overwrite) {
          _template = fields;
        } else {
          _template = $.extend(true, _template, fields);
        }

        return $.extend(true, {}, _template);
      };
    };
  };

  // Export package
  module.exports = Sb;

}).call(this);