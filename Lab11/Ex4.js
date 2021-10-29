var attributes = "Jacky;20;20.5;-9.5";

var parts = attributes.split (';');

/*for (parts of parts){
    console.log(`${part} isNonNegInt: ${Check_If_String_Is_Non_Neg_Int(part)}`)
};
*/
parts.forEach((item, index) => { console.log(`part ${index} is  ${(Check_If_String_Is_Non_Neg_Int(items)?'a':'not a')} quantity`);
});

function Check_If_String_Is_Non_Neg_Int(q,returnErrors = false) {
    //Check if a string q is a non-neg integer. If returnError is true, the array of errors is rteurn. Otherwise returns true if q is a non-neg int.
    if (q =='') q=0;
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0)
} ;

function checkIt( items, index){
    console.log(`part ${index} is  ${(Check_If_String_Is_Non_Neg_Int(items)?'a':'not a')} quantity`);
}