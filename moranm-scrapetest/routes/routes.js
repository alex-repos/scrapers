
var User = require('../models/user')();
var scraper = require('../lib/scraper');

module.exports = function (app, passport) {
	


	app.get('/', function(req,res){
		res.send('Hello Anonymous user.') ;
	});
	
	app.post('/login', passport.authenticate('local-login',{ session: false }), function(req, res){
		res.json({
			success :req.isAuthenticate,
			token : req.apiKey
		});
	});

	app.post('/signup', passport.authenticate('local-signup',{ session: false }), function(req, res){
		res.json({
			success :req.isAuthenticate,
			token : req.apiKey
		});
	});
	
	app.get('/scrape',isLoggedIn, function(req, res){
		scraper.scrape(req,res);
	});

    app.get('/user/recipes', isLoggedIn, function(req, res){
        //fetchUserRecipeFlow.fetchAll()
    })

}

function isLoggedIn(req, res, next) {
    User.findOne({'local.apiKey':req.query.token}, function(err, user){
        if(err) {
            res.status(500);
            res.end();
        }

        if (user){
            req.user = user;
            return next();
        }

        res.status(401);
        res.end();
    });
}