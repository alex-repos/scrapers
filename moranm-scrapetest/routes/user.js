
/*
 * GET users listing.
 */

var users = [{
	user:"liron",
	pass:"qwe123"
}];


exports.authenticate = function(user, password){
	return user == users[0].user && password == users[0].pass;
}

exports.list = function(req, res){
  res.send("respond with a resource");
};