// Server was made on 11.21.2021 Jacky Pang ASSIGNMENT 1 

// Pull all data from array to here jason wasn't working had a overflow error
var products = require('./products.json');
// creating a const variable called queryString so that I can use the querystring module, this is the default code for accessing. (per nodejs.org) 
const queryString = require('query-string');
// assignment 1 boiler plate.
var express = require('express');
// putting the express module into a variable called app
var app = express();
// created to allow me to use the body-parser module 
var myParser = require("body-parser");
const e = require('express');

var tmnp_qty_data; // for hold qty data until invoice

// Routing 

// monitor all requests
app.all('*', function (request, response, next) { // this is required because i am using express to route. it will allow me to make requests
    console.log(request.method + ' to ' + request.path); // this writes the request into the console
    next();
});
// Updating for products data and its display when purchasing stuff
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

app.use(myParser.urlencoded({ extended: true })); // setting the parser to true to deal with nested objects. (read more about what this line does on stackoverflow)

app.post("/login.html", function (request, response) {
    // check that username and password match

    
    let params = new URLSearchParams(tmnp_qty_data);
    response.redirect('./invoice.html?' + params.toString() );
});


app.post("/process_purchase", function (request, response) {
    let POST = request.body; // Forms the data in the body

    //Use to valididate the purchase or quantity buying if valid send to invoice if not resend to product display 
    var hasvalidquantities = false;
    var hasquantities = false;

    //Checck all product quantities
    hasvalidquantities = true; //assume the variable is true to combine things, false if ...
    // loop through all quantiotoes and check if valid
    for (i in products) {
        // Get quantity from the textbox for products i, meaning 0 
        qty = request.body[`quantity${i}`];
        // Check if qty is Non Negative Interger 
        hasvalidquantities = isNonNegInt(qty) && hasvalidquantities; // This is a flag, any invalid qty will make false 


        // Check if qty is greeater than quantity available.
        hasvalidquantities = (qty <= products[i].quantity_available) && hasvalidquantities;

        // check if at least one item was selected
        hasquantities = hasquantities || (qty > 0);
console.log(qty,i, hasquantities, hasvalidquantities);
    }

    // if quantities are good, go to login
    if (hasvalidquantities && hasquantities) {
        tmnp_qty_data = POST;
        response.redirect("./login.html");
    }
    else {
        let params = new URLSearchParams(POST);
        response.redirect("products_display.html?" + params.toString());
    }

});

// Process registration form POST method and redirect to invoice page if ok or back to registration page if not
app.post("/registration.html", function (request, response) {

    username = request.body.username;//retrieves the username data
    errors = {};//Checks to see if username already exists

    // Username validation SEE LINK FOR Stuff Below below https://www.codegrepper.com/code-examples/javascript/username+validation+js
    if (typeof users_reg_data[username] != 'undefined') {
        errors.username_error = "Username is Already in Use"; //if username is in json file, say username is already in use
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) { //only allows numbers and letters for the username
        errors.username_error = "Only numbers/letters";
    }
    if ((username.length > 12) == true) {
        errors.username_error = "Please make your username shorter"; //if length is more than 12, show error to make the username shorter
    }
    if ((username.length < 4) == true) {
        errors.username_error = "Please make your username longer"; //if length is less than 4, show error to make the username longer
    }

    //Fullname Validation // got help for the first fullname validation from Mr. Port
    fullname = request.body.fullname;//retrieves the fullname data
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
        errors.fullname_error = "Please use letters and spaces";
    }

    if ((fullname.length > 22) == true) {
        errors.fullname_error = "Please make your full name shorter. 30 characters max"; //if length is greater than 22, send error that 22 characters are max
    }

    //Email Validation//
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
        errors.email_error = "Please enter proper email";
    }

    // Runs this part of the if statement if all conditions are met this includes login verification
    const stringified = queryString.stringify(POST);
    if (hasvalidquantities) {
        //hasvalidquantites remove things from current inventory
        for (i in products) {
            products[i].quantity_available -= POST[`quantity${i}`] * 1;
        }
        response.redirect("./invoice.html?" + stringified); // -Jack yOpens iNvoices don't know why strinified was suggesteed seems redudnant to me Need to discuss
    }
    else {
        response.redirect("./products_display.html?" + stringified) // revisti invoice 
    }
    console.log(errors, users_reg_data);
    //If there are 0 errors, request all registration info
    if (Object.keys(errors).length == 0) {
        users_reg_data[username] = {};
        users_reg_data[username].username = request.body.username
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].fullname = request.body.fullname;

        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file
        theQuantQuerystring = qs.stringify(flowerquant); //Turns quantity object into a string
        response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //If all good, send to the invoice page with username/quantity info
    } else {
        qstring = qs.stringify(request.body) + "&" + qs.stringify(errors);
        response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
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
