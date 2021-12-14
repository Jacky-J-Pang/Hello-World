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
// Routing 

// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

// process purchase request (validate quantities, check quantity available)

// route all other GET requests to files in public 
app.use(express.static(__dirname + '/public'));
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
     //Ensures data inputted isn not a negative number, does not contain letters and is not a decimal
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume no errors at first
   if (q == "") { q = 0; } //handle blank inputs as if they are 0
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
   //if (params[`quantity${i}`] <= products[i].quantity_available) errors.push ('Quantity exceeds in current stocks') NEED TO CHECK THE FUNCTION KEEPS CRASHING
   // CANT UPDATE INVENTORY EITHER 
   return returnErrors ? errors : (errors.length == 0); //returns as error
}

app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
   next(); //calls the middleware function
});
// start server
app.listen(8080, () => console.log(`listening on port 8080`));