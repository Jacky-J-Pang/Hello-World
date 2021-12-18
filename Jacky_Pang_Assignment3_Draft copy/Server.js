// Jacky Pang Last Updated: 12/15/2021
/*
All Server reference are either from previous assignment or the following link 
https://expressjs.com/en/5x/api.html 
https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html
http://expressjs.com/en/advanced/best-practice-security.html#dont-use-the-default-session-cookie-name 
Got Helped from Dr.Port 
https://www.youtube.com/watch?v=dPGfRKNEhd8&ab_channel=GoogleChromeDevelopers 
https://stackoverflow.com/questions/21558763/playing-mp3-on-website-created-with-node-js THIS IS FOR AUIDIO LOAD
*/

// VARIABLES BELOW

//Included on previous assignemnts 
var express = require('express');
var app = express();
var myParser = require("body-parser");
var filename = './user_data.json' //accessing user login
var fs = require ('fs');

// Load product files into the server side codes to reduce lag time found out with the MP3 files
var data = require('./products.json')

// 
var queryString = require('query-string');
const qs = require ('qs');

// Loads Cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Loads up session
var session = require('express-session');

// Packet to send a email to the clients
var nodemailer = require('nodemailer');
const { exit } = require('process');


//Below are routing 

// monitor all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });

 // Microservice to define products object by request
app.get('/products.js', function (request, response, next) {
    response.type('js');
    response.send(`var products = ${JSON.stringify(products)};`);
 });

//COOKIES

// Seting Cookies
app.get('/set_cookie', function (req, res, next) {
    let x = 'Trial 101';
    res.clearCookie('x');
    res.send(`Cookie for ${x} sent!`);
});
 // Execute cookies
 app.get('./use_cookie', function (req, res, next){
    if (typeof req.cookies['username'] != 'undefined'){ 
        res.send(`Hello ${req.cookies ['username']}!`)
        // Code reference from abovehttps://www.geeksforgeeks.org/express-js-res-send-function/ res.send function is basically the res.send function
    }
    else if ( typeof req.cookies['username'] != 'undefined'){
        res.send('Unkown User Detected, please relogin ')
    }
    // PRobelm Crashed Deleted the following portion
 });

 // SESSION SETTINGS
 app.use(session({ secret: "I Hate Finals Week!", saveUninitialized: false, resave: false }));
 // decode form post data
 app.use(express.urlencoded({ extended: true }));

/*
// Loads file service. Taken from Assignment 2
if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    var data = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data);
} else {
    console.log(filename + 'does not exist!'); // If file doesn't exist, show in console
}

// Checks for the existence of the file, from Lab 14
if (fs.existsSync(filename)) {
    var data = fs.statSync(filename);
    data = fs.readFileSync(filename, 'utf-8'); // If it exists, read the file user_data.json storedin filename
    var user_data = JSON.parse(data); // Parse user data
} else {
    console.log(`${user_data} does not exist!`) // If it doesn't exist, send a message to console
    exit();
}
*/


//PROCESSING SHOP HOME PAGE
app.post("/process_page", function (request, response) {
    //look up request.query
    let params = request.body;
    var prod_key = params['pkey'];
 
    if (typeof params['purchase_submit'] != 'undefined') {  //check if quantity data is valid
       has_errors = false; // assume quantities are valid from the start
       total_qty = 0; // need to check if something was selected so we will look if the total > 0
       for (i = 0; i < products[prod_key].length; i++) {
          if (typeof params[`quantity${i}`] != 'undefined') {
             a_qty = params[`quantity${i}`]; //makes textboxes sticky in case of invalid data change the original code from flag it just makes more sense for me
             total_qty += a_qty; //Adds up all quantities to check if any quantity is inputed at all
             if (!isNonNegInt(a_qty)) {
                has_errors = true; // Invalid quantity
             }
          }
       }
   // Now respond to errors or redirect to invoice if all is ok
   let qstr = new URLSearchParams(params);
   //if quantity data is not valid, add the errors to qstr
   if (has_errors || total_qty == 0) {
      console.log('has errors in process page');
      qstr.append('errors', 'There was an error');
   } else {
      // if quantity data is valid, add quantities to shopping cart
      if (typeof request.session.cart == 'undefined') {
         request.session.cart = {};
      }
      request.session.cart[prod_key] = params;
      console.log(request.session.cart);
   }
   // send them to the product display
   response.redirect("shop.html?" + qstr);
}
});

//SHOPPING CART ADD PROCESS 

// Add to shopping cart 
app.post("/addtocart", function (req, res) {
    console.log(req.body); // Shows request body in console
    itemdata = req.body;// Sets the itemdata variable to the request body
    // If quantities are valid, add the items to cart. If not, return the errors according to isNonNegInt function
    if (isNonNegInt(itemdata.quantity)) {
        if (typeof req.session.cart == "undefined") { // If there is no shopping cart in the session, make a cart
            req.session.cart = {}; // Assume cart is empty at first. Items will be added to this object for the user's session
        }
        if (typeof req.session.cart[itemdata.producttype] == "undefined") { // If the product type is undefined, create a product array for it
            req.session.cart[itemdata.producttype] = []; // Empty array where product type will be added
        }
        if (typeof req.session.cart[itemdata.producttype][itemdata.productindex] == "undefined") { // If the product type doesn't exist in the cart, make space to add the product
            req.session.cart[itemdata.producttype][itemdata.productindex] = 0; // Index of 0 where product will be added
        }
        req.session.cart[itemdata.producttype][itemdata.productindex] += parseInt(itemdata.quantity); // Parse quantity to an integer instead of a string!
        res.send(`Added ${itemdata.quantity} of ${itemdata.producttype} fragrance to cart`);// Alert message that _ quantity of _ item was added to cart
        console.log(req.session.cart); // Show request of shopping cart from session in the console
    } else {
        res.send(`Invalid quantity!`); // Send a response stating the quantities are invalid. Nothing added to cart
    }
});
// Load the shopping cart to server
app.post("/loadcart", function (req, res) { // If we have not previously requested the cart data, create an object for it
    if (typeof req.session.cart == "undefined") {
        req.session.cart = {}; // Cart object
    }
    res.json(req.session.cart) // Cart data will be in JSON format

});

// Process login
app.post("/process_login", function (req, res) {
    var loginError = []; // Assume no login errors at first. Add all errors into this array
    var ClientUsername = req.body.username.toLowerCase(); // Put the username in lowercase and check against user_data.json file 
    if (typeof user_data[ClientUsername] != 'undefined') {// If username has a match in database, return the object
        // Match the password next
        if (user_data[ClientUsername].password == req.body.password) { // Check password against user password from database
            req.query.username = ClientUsername;
            req.query.name = user_data[req.query.username].name
            res.cookie('username', ClientUsername); // Send cookie associated with username to session
            res.redirect('./productdisplay.html?pkey=Chanel');// If successful login, edirect to store
            return;
        } else { // If username or password is wrong, display a message containing the specific errors
            req.query.username = ClientUsername; // Sets the username to the username inputted by customer
            req.query.name = user_data[ClientUsername].name; // Confirms the userername input is the same 
            req.query.loginError = loginError.join(' '); // Join errors with a space
        }
    } else { // If the username is invalid or doesn't exist in database, push the error
        loginError.push = ('Invalid username!'); // Error message
        req.query.loginError = loginError.join(' '); // Join errors with a space
    }
    res.redirect('./login.html?' + queryString.stringify(req.query));// Redirect to login page if there are errors so customer can try again
});
app.post("/login.html", function (request, response) {
    the_username= request.body.username.toLowerCase(); //makes username case insensitive, a little work around compare to the [] rules listed on the bottom lol
    //Validate login data
    if(typeof users_reg_data[the_username] != 'undefined'){   //To check if the username exists in the json data
      if( users_reg_data[the_username].password ==request.body.password){
               theQuantQuerystring = qs.stringify(wallpaperemp); //make the query string of prod quant needed for invoice
               response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`); //Adds username & quantity to invoice
      }
       else {
          response.send('Invalid Login: Please hit the back button and try again'); //if password isn't equal to password existing in jsonn data, show error message
      }  
  }
  if (response.send('Invalid Login: Please hit the back button and try again ')){
   
   }
});

 // Process registration form POST method and redirect to invoice page indentation got lazy 
app.post("/registration.html", function (request, response) {
   // process a simple register form
   console.log(wallpaperemp); // personal prefernce to keep it consistnet witht he login app.POST function above. doesnt do much stuff 
 
   username = request.body.username;//retrieves the username data
   errors = {};//Checks to see if username already exists a variable pplace holder essentially 
 
   //Username Validation Learn the validation stuff on this websites https://www.dofactory.com/javascript/regular-expressions || https://www.w3schools.com/jsref/jsref_regexp_not_0-9.asp
   if (typeof users_reg_data[username] != 'undefined'){
      errors.username_error="Username is Already in Use"; //if username is in json file, say username is already in use
   }
   if ((/[a-z0-9]+/).test(request.body.username) ==false){ //only allows numbers and letters for the username
      errors.username_error="Only numbers/letters";
   }
   if ((username.length > 10) ==true){
      errors.username_error = "Please make your username shorter"; //if length is more than 10, show error to make the username shorter
   }
   if ((username.length < 4) ==true){
      errors.username_error = "Please make your username longer"; //if length is less than 4, show error to make the username longer
   }
//Fullname Validation // see above for soruces repeated thorughout registeration loop 
fullname = request.body.fullname;//retrieves the fullname data
   if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false){
      errors.fullname_error="Only use letters and a space";
   }
   if ((fullname.length > 30) ==true){
      errors.fullname_error = "Please make your full name shorter. 30 characters max"; //if length is greater than 30, send error that 30 characters are max
   }
//Email Validation//
   if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
      errors.email_error="Please enter proper email";
   }      
//If there are 0 errors, request all registration info
if (Object.keys(errors).length == 0){
   users_reg_data[username] = {};
   users_reg_data[username].username = request.body.username
   users_reg_data[username].password = request.body.password;
   users_reg_data[username].email = request.body.email;
   users_reg_data[username].fullname = request.body.fullname;
fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file
theQuantQuerystring = qs.stringify(wallpaperemp); //Turns quantity object into a string
   response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //If all good, send to the invoice page with username/quantity info
} else { 
   qstring= qs.stringify(request.body)+"&"+qs.stringify(errors); 
   response.redirect('/registration.html?' + qstring ); //if there are errors, send back to registration page to retype
}  
});

//LOG IN AND OUT FUNCTIONS

// Log out function
app.get("/logout", function (req, res) {
    res.clearCookie('username'); // Cleat the cookie associated with the username of the customer logged in
    // Save the script that logs the user out into the str variable and redirect to the home page.
    str = `<script>alert("${req.cookies['username']} is logged out"); location.href="./index.html";</script>`; 
    res.send(str); // Send the str variable
    req.session.destroy(); // Destroy the session containing the cart info and cookies
});


// INVOICE & Sending email
// Process checkout. Modified from Assignment 3 Code Examples (https://dport96.github.io/ITM352/morea/180.Assignment3/reading-code-examples.html)
app.post("/checkout", function (req, res) {
    var invoice_str = `Thank you for your order!<table>`; // Creates invoice that will be sent to email
    var shopping_cart = req.session.cart; // Set shopping cart as the cart requested from the session
    for (pkey in products) {
        for (i = 0; i < products[pkey].length; i++) {
            if (typeof shopping_cart[pkey] == 'undefined') continue;
            qty = shopping_cart[pkey][i];
            if (qty > 0) {
                invoice_str += `<tr><td>${qty}</td><td>${products[pkey][i].brand}</td><tr>`;
            }
        }
    }
    invoice_str += '</table>';

    // Decodes the invoice that was encoded
    invoice_str = decodeURI(req.body.invoicestring);
    var transporter = nodemailer.createTransport({
        // Because we are using UH as the host, we must be using their network for the email to work
        host: "mail.hawaii.edu",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Info of sender
    var user_email = 'noreply@heavenscent.com';
    var mailOptions = {
        from: 'HEAVENSCENT',
        to: user_email,
        subject: 'Your Order from HEAVENSCENT!',
        html: invoice_str
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { // If there are errors in sending invoice (e.g., due to network issue), display error message below invoice
            invoice_str += `<p>There was an error and your invoice was not sent!</p> <p>Return to <a href="/index.html">HEAVENSCENT</p>`;
        } else { // Otherwise, show that the email was sent successfully
            invoice_str += '<p>The invoice was sent to your email. Enjoy your heaven scent!</p> <p>Return to <a href="/index.html">HEAVENSCENT</p>';
        }
        req.session.destroy(); // Destroys session after checkout
        res.send(invoice_str);
    });
});

 // route all other GET requests to files in public 
app.use(express.static(__dirname + '/public'));
// start server
app.listen(8080, () => console.log(`listening on port 8080`));
