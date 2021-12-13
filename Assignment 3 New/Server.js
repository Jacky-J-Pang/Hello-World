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

app.use(myParser.urlencoded({ extended: true }));
//GET purchase submission form, if good give an invoice, otherwise send back to order page

app.get("/process_page", function (request, response) {
    //look up request.query
    wallpaperemp = request.query;
    params = request.query;
    console.log(params);
    if (typeof params['purchase_submit'] != 'undefined') {  //check if quantity data is valid
       has_errors = false; // assume quantities are valid from the start
       total_qty = 0; // need to check if something was selected so we will look if the total > 0
       for (i = 0; i < products.length; i++) {
          if (typeof params[`quantity${i}`] != 'undefined') {
             a_qty = params[`quantity${i}`]; //makes textboxes sticky in case of invalid data change the original code from flag it just makes more sense for me
             total_qty += a_qty; //Adds up all quantities to check if any quantity is inputed at all
             if (!isNonNegInt(a_qty)) {
                has_errors = true; // Invalid quantity
             }
          }
       }
         // Now respond to errors or redirect to invoice if all is ok
       qstr = querystring.stringify(request.query);
       //if quantity data is not valid, send them back to product display
       if (has_errors || total_qty == 0) { 
          qstr = querystring.stringify(request.query);
          response.redirect("products_display.html?" + qstr);
       } else { // if quantity data is valid, send them to the invoice
          response.redirect("login.html?" + qstr);
       }
    }
 });