//key variables 
var month = 'October';
var day = 21;
var year =2001;

//Monthkey variable and days
monthkey = {
    January: 0,
    February: 3,
    March: 2,
    April: 5,
    May: 0,
    June: 3,
    July: 5,
    August: 1, 
    September: 4,
    October: 6,
    November: 2,
    December: 4
};

WeekNumofWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

// operation for execution of code
    step_1 = (month == 'January' || 'February') ? (year -1): year;
    step_2 = step_1 + parseInt(step_1/4);
    step_3 = step_2 - parseInt(step_1/100);
    step_4 = step_3 - parseInt(step_1/400);
    step_5 = step_4 + day;
    step_6 = step_5 + monthkey[month];
    step_7 = step_6 % 7;

// Print.ln  (printing result out)

console.log(`${month} ${day} was a ${WeekNumofWeek[step_7]}`);
