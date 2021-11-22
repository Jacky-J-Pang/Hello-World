 // Server was made on 11.21.2021 Jacky Pang ASSIGNMENT 1 

// Pull all data from array to here jason wasn't working had a overflow error
 var data = require('./public/products.js');
  
// creating a const variable called queryString so that I can use the querystring module, this is the default code for accessing. (per nodejs.org) 
const queryString = require('query-string'); 

// assignment 1 boiler plate.
var express = require('express');  

// putting the express module into a variable called app
var app = express(); 
// created to allow me to use the body-parser module 
var myParser = require("body-parser"); 


// Routing 

// monitor all requests
app.all('*', function (request, response, next) { // this is required because i am using express to route. it will allow me to make requests
    console.log(request.method + ' to ' + request.path); // this writes the request into the console
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); // setting the parser to true to deal with nested objects. (read more about what this line does on stackoverflow)

app.post("/process_purchase", function (request, response) {
    let POST = request.body; // Forms the data in the body

    // This statement was taken in pieces by a friend and bits from the INTERNET NEED TO DISCUSS LATER w/ DR?.PORT
    if (typeof POST['submitPurchase'] != 'undefined') {
        var hasvalidquantities=true; //Answer will be true unleess ... See below
            for (i = 0; i < products.length; i++) {
            qty=POST[`quantity${i}`];
            qty>0 ; // Checks if quantity is greater than 0 or less than 6 
            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // Uses an and statement to return whether or not both conditions are true (not negative and greater than 0)    
        } 
        // Runs this part of the if statement if all conditions are met 
        const stringified = queryString.stringify(POST);
        if (hasvalidquantities) {
            response.redirect("./invoice.html?"+stringified); // -JackyOpens iNvoices don't know why strinified was suggesteed seems redudnant to me Need to discuss
        }  
        else { 
            response.redirect("./products_display.html?" + stringified) // revisti invoice 
        }
    }
});

/* Since the server is totally separate from the pages, I had to copy and paste the isNonNegInt function onto the server itself, or it would not be able to check. */
function isNonNegInt(q, returnErrors = false) {
    errors = []; // Setting up an array called errors
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // pushes an error if the number is not an actual number
    if (q < 0) errors.push('Negative value!'); // pushes an error if it's a negative number
    if (parseInt(q) != q) errors.push('Not an integer!'); // pushes an error if it's not a whole number
    return returnErrors ? errors : (errors.length == 0); 
}

app.use(express.static('./public')); // this sets public as the root for the express node module
app.listen(8080, () => console.log(`listening on port 8080`));  //For this server it was required for us to make it listen on port 8080. 
