var http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const port = (process.env.PORT || 8080);

// App
var app = module.exports = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Mongoose
const mongoose = require('mongoose');
const baseUrl = require('./baseUrl'); // require base url of the database
const path = require('path');


// REUQIRE ROUTES
require('./routes/login');
require('./routes/register');
require('./routes/changeEmail');
require('./routes/changePassword');
require('./routes/forgottenPassword');
require('./routes/blog');
require('./routes/article');
require('./routes/profile');
require('./routes/recipe');
require('./routes/ingredients');
require('./routes/pcfbalanced');
require('./routes/dishbalanced');
//
//
// require('./routes/sharedRecipes');
// require('./routes/editSharedRecipe');

require('./routes/admin/ingredients');
require('./routes/admin/users');


app.get('/editSharedRecipe/:id', function(req, res){
    res.render('oups', {message: "soon"});
})


app.get('/sharedRecipes', function(req, res){
    res.render('oups', {message: "soon"});
})

app.get('/google50578b0c1fd00040', function(req, res){
    res.sendFile(path.join(__dirname + "/google50578b0c1fd00040.html"));
})


app.get('/', function(req, res){
    res.render("index");
})

app.get('/logout', function(req, res){
    res.clearCookie("EnergyUserId");
    res.clearCookie("EnergyUsername");
    res.clearCookie("EnergyAdminId");
    console.log("logout");
    res.redirect('/');
});


app.get("*", function(req, res){
    res.render("oups");
})

//LISTEN

app.listen(port, () => {
  console.log('Express server listening on port', port)
});
