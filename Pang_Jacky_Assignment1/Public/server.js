 /* Pull all data from the array to server*/
   var products_array = require('./Products.json');

// created a shorten version of the command to use the body-parser module
   var myParser = require("body-parser"); 

 // Found this on stackoverflow, kind of fixed my problem --> set parser as true for nested objects. 
 app.use(myParser.urlencoded({ extended: true }))

 // To send a query program to recover a specific information (Found nodejs.org)
   const queryString = require('query-string'); 

// Below is the code taken directly from Assignment 1
   var express = require('express');
const { products } = require('../../Reference Guide Assignment1/public/products');
   var app = express();
   
   // Routing 
   
   // monitor all requests
      app.all('*', function (request, response, next) {
         console.log(request.method + ' to ' + request.path);
         next();
      });
      
   // process purchase request (validate quantities, check quantity available)
      function isNonNegInt(x, returnErrors = false) {
       errors = []; // Setts up a error array
       // pushes an error if the number is not an actual number
         if (Number(x) != x) errors.push('Not a number!');
            if (x < 0) errors.push('Negative value!'); 
            // pushes an error if it's a negative number
               if (parseInt(x) != x) errors.push('Not an integer!'); 
            // pushes an error if it's not a whole number
         return returnErrors ? errors : (errors.length == 0); 
      }
// Forms the data in the body APP.POST code was eddited by Alexandria L. 
app.post ("/process_purchase", function (request,response) {
   let POST = request.body; //Get and update data within the server
      //Detreming postives or no
      if(typeof POST['Purchase'] != 'undefined') {
         var ValidNumber= true; // Rreturn true unless the following
         var hasquantities=false
         
         for ( i=0; i <products.length; i++ ) {
            qty = POST[`quantity${i}`] // treat as string dynamic purposes
            hasquantities = hasquantities || qty > 0  //Check if number is moire than 0 
            ValidNumber = ValidNumber  && isNonNegInt(qty);
               // state to return whether or both conditons are sture 
         }
      //  Program will run if the above stement is true
         const stringified = queryString.stringify(POST);   
         if(ValidNumber && hasquantities == true ) {
            response.redirect("./invoice/Invoic_Page.html")
         }
         else {
            response.redirect(documetn.write("Data Entry Invalid! Press the Back Button to go back to the webpage"));
           }
      }   
   }      
);
   

   // route all other GET requests to files in public 
    app.use(express.static('./public'));
   
   // start server
    app.listen(8080, () => console.log(`listening on port 8080`));