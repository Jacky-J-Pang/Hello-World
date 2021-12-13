//Description: The server for the Runeterra card store


//Below r variables for simpler code function 
const querystring = require('querystring'); //Cannot change anything within the querystring
var express = require('express'); //initializes express to set up web server
var myParser = require("body-parser"); //initializes body-parser to set up web server
var products = require("./public/product.js"); // import product.jsfiles 
var filename = 'user_data.json' //Defines the user_data.json array as an object
var app = express(); //Executes Express
var qs = require('querystring'); //Needs querystring in order to initiate functions
var qstr =  {}; //Defines qstr as a variable containing information to be passed to login page
var wallpaperemp = {}; //Defines wallpaperemp as a variable that requests the query string
// End of variable groups

app.get