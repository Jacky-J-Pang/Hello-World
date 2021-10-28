var attributes = "Jacky;20;20.5;-9.5";

var parts = attributes.split (';');

for (parts of parts){
    console.log(`${part} isNonNegInt: ${isNonNegInt(part)}`)
};
function isNonNegInt(q,returnErrors = false) {
    //Check if a string q is a non-neg integer. If returnError is true, the array of errors is rteurn. Otherwise returns true if q is a non-neg int.
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0)
} ;
