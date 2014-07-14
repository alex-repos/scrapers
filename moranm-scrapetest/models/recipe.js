var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    name: String,
    description: String,
    url: String,
    instructionsSet: [String],
    ingredients: [String],
    images: [String]
});

recipeSchema.methods.validateUrl = function (url) {
    //todo: add url validation logic
    return true;
};


module.exports = function () {
    return mongoose.model('Recipe', recipeSchema);
};