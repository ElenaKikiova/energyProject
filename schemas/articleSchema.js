//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var ArticleSchema = mongoose.Schema({
    Title: String,
    Pinned: Boolean,
    Description: String,
    Keywords: String,
    Topics: Array,
    Text: Array
},
{ collection: "articles" }
);

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
