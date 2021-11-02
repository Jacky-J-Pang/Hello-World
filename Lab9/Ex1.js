var month = 1;
var day = 21;
var year = 2001
// algorthim start
step1 = year - 2000;
step2 = parseInt(step1/4);
step3 = step1 + step2;
//Skip step4 and step 6 to step 7 not applicable 
step5 = day + step3;
step8 = step5 
step9 = step8 -1 ; //not a leap year so minus 1
step10 = step9 % 7 // % give you the remiander of whatever precedes

console.log (step10);

//end of ex1.js
