 /* Pull all data from the array to server*/
   var products_array = require('./Product.json');
// created to allow me to use the body-parser module
   var myParser = require("body-parser"); 

// To send a query program to recover a specific information (Found nodejs.org)
   const queryString = require('query-string'); 


// Below is the code taken directly from Assignment 1
   var express = require('express');
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
         if (q == "") { x = 0; }
         if (Number(x) != x) errors.push('Not a number!'); // pushes an error if the number is not an actual number
         if (x < 0) errors.push('Negative value!'); // pushes an error if it's a negative number
         if (parseInt(x) != x) errors.push('Not an integer!'); // pushes an error if it's not a whole number
         return returnErrors ? errors : (errors.length == 0); 
      }
   // route all other GET requests to files in public 
    app.use(express.static('./public'));
   
   // start server
    app.listen(8080, () => console.log(`listening on port 8080`));