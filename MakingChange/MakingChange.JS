// input amount
var amountInput = 77


//calculation
var quarter =  parseInt(amountInput / 25 );
    var leftover1 = amountInput % 25;

var dimes = parseInt (leftover1 / 10);
    var leftover2 = dimes % 10;

var nickles = parseInt ( leftover2 / 10);
    var leftover3 = amountInput % 5;

var penny = parseInt(leftover3);

//printing format 
console.log (`We returned ${quarter} quaters, ${dimes} dimes, ${nickles} nickels, and ${penny} pennies!`)