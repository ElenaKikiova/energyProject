// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var Article = require('../schemas/articleSchema');

app.get('/article/:id', function(req, res){
    var ArticleId = req.params.id;
    var idCookie = getUserCookie("id", req);

    if (ArticleId.match(/^[0-9a-fA-F]{24}$/)) {
        mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
            Article.findById({_id: ArticleId}, function(err, article) {
                if(err) throw err;
                if(article != null){
                    res.render('article', {Article: article, userId: idCookie});
                }
                else{
                    res.render('oups');
                }
            });
        });
    }
    else{
        res.render('oups');
    }

});
