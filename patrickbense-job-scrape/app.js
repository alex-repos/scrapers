var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,
    getJobs = require('./getJobs').updateJobs;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

MongoClient.connect('mongodb://localhost:27017/jobs', function(err, db) {
    "use strict";
    if(err) throw err;

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req,res,next){
        req.db = db;
        next();
    });
    
    app.use('/', routes);
    app.use('/users', users);

    /// catch 404 and forwarding to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    getJobs(db, function (responses) {
        console.log('got new jobs at: ' + Date());
    });

    setInterval(function () {
        getJobs(db, function (responses) {
            console.log('got new jobs at: ' + Date());
        });
    }, 86400000); // 24 hours
});

module.exports = app;
