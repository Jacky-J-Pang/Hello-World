//Description: The server for the Jacky's Wallpaper Serverside code was reviewed and made changes in the depreceated code only in this file by Alexandria Lim and Zi jun. 
// Deprecated code instead of removing it compeltley because the code used is kinda depenednet on the the prefix of this code, if deleted altogether gotta restrucutrea alot of stuff
// saves time!

// Jacky Pang all the marked code with deprecetaed code is comes from below depreceated code 
//https://docs.moodle.org/dev/Deprecation#:~:text=Deprecation%2C%20in%20its%20programming%20sense,so%20may%20cause%20regression%20errors.
const querystring = require('querystring'); //Cannot change anything within the querystring

var express = require('express'); //initializes express to set up web server
var myParser = require("body-parser"); //initializes body-parser to set up web server
var products = require("./public/product.js"); // import product.jsfiles 
var filename = 'user_data.json' //Defines the user_data.json array as an object
var app = express(); //Executes Express
var qs = require('querystring'); //Needs querystring in order to initiate functions
var qstr =  {}; //Defines qstr as a variable containing information to be passed to login page
var wallpaperemp = {}; //Defines wallpaperemp as a variable that requests the query string





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
//if quantity data valid, send them to the login page see below the code 

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



fs = require('fs'); //Use the file system module 

//returns a boolean (true or false) (Opens file only if it exists)
if (fs.existsSync(filename)) {
   stats=fs.statSync(filename) //gets the stats of your file
  

data=fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.
users_reg_data = JSON.parse(data); //Parses data in order to turn string into an object
}



//Login Page
app.get("/login.html", function (request, response) {
   // Copy pasted from the login.html got lazy to import it so i turned it into string

   str = `
   <html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Please Login Before Proceeding to Checkout!</title>

<link rel="stylesheet"  href="./stylesheets/navbar.css">
<link rel= "stylesheet" href="./stylesheets/products-style.css">
<link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Lobster">
<!-- New Background n stuff-->
<style>
body 
{
   text-align: center;
   font-family:'Lobster', 'Open Sans';
   background: linear-gradient(45deg, lightblue,pink, lightgreen);
  
}

</style>


</head>


<body>
<ul> 
   <!-- Nav Bar-->
   <li style="float:left"><a href="./index.html">Home Page </a></li>
   <li><a class="active" href="./products_display.html"> Static </a></li>
   
</ul>
<h1>Jacky's Wallpaper Login</h1>

<h2>To continue purchasing, please login below</h2>
<form name="loginform" method="POST"> 
   <div>
   <input type="text" name="username" size="40" placeholder="enter username" ><br /> 
   <input type="password" name="password" size="40" placeholder="enter password"><br />
   <input type="submit" value="login" id="submit">  </div>
   </form>  
</body>

<h2> Register Below!</h2>

<body>
<div>
<form action="./registration.html">
<input type="submit" value="Register Here" id="regpage" name="register_here">
</form>
</div>

</body>

</html>
   `;
   response.send(str); //NOTE TO Self Remember to change this to string again 
});


  // Check & Process login form POST and redirect to invoice page
app.post("/login.html", function (request, response) {
    console.log(wallpaperemp); //to see anyerrors would occur and what they are 
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


//got lazy with the indentation 

console.log(errors, users_reg_data);
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





app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path); //respond to HTTP request by sending type of request and the path of request
   next(); //calls the middleware function
});
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080