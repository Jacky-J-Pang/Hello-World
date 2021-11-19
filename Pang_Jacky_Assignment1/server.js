var data = require('./Products.js')
var express = require('express');
var app = express(); // 
var products_array = require('./Product_data.json'); // Pull Data 
// Routing seen above

// monitor all requests (The code in btoom directly represents a express route)
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

// process purchase request (validate quantities, check quantity available)


// route all other GET requests to files in public 
app.use(express.static('./public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));