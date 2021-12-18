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
console.log(`Final really be killing all of us `); //this is for kicks and gigels.. https://www.youtube.com/embed/dQw4w9WgXcQ click me if you want;)
var express = require('express');
var app = express();
const fs = require('fs');
var session = require('express-session');
const { connect } = require('http2'); //allows multiple request and response messages to be in flight at the same time, over the same TCP connection
var products_data = require('./products.json');


app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

// Taken from https://mailtrap.io/blog/nodemailer-gmail/
// this is requires the nodemailer package
const nodemailer = require('nodemailer');

// 3 codes below taken from assignment 2, just takes the user_reg_data and gives it to the server
// gets the user data and puts that into a variable to use to give to pages
var all_user_data = require('./user_data.json');
const { exit } = require('process');

// User info JSON file
var filename = './user_data.json';

// Was told by ZHI JUN THIS MIGHT BE GOOD PRACICE TO INCLUDE EVEN IF IT IS REDUNDNANT CHECK TO SEE IF IT CAN REQAAD THE USSERS
if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    var user_data_str = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(user_data_str);
    console.log(`Found User Data!`);
    //console.log(users_reg_data);
} else {
    console.log(filename + 'does not exist!');
    users_reg_data = {};
}

app.all('*', function (request, response, next) {
    console.log(`Got a ${request.method} to path ${request.path}`);
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
    next();
});

app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});


// Taken from assignment 3 code examples
app.post("/add_to_cart", function (request, response) {
    // ''Borrow'' from Brandon classmate
    console.log(request.body);
    let params = new URLSearchParams(request.body);
    var product_key = request.body['products_key'];
    var quantity_submit = request.body['quantity'];

    // set errors as a palce holder as of now 
    var errors = {};
//checking for valid quantites
    for (i in products_data[product_key]) {
        let q = quantity_submit[i];
        if (isNonNegInt(q) == false) {
            errors[`quantity[${i}]`] = `${q} is not a valid quantity!`;
        } else {
            if (q > products_data[product_key][i]['quantity_available']) {
                errors[`quantity[${i}]`] = `We don't ${q} in stock!`;
            }
        }
    }

    // if there arent any errors, then we add it to the cart via sessions got help in the if statements from ZHI JUN.
    if (Object.keys(errors).length === 0) {
        if (typeof request.session.cart == 'undefined') {
            // create a empty one if there is none created as aplace holder
            request.session.cart = {};
        }
        if (typeof request.session.cart[product_key] == 'undefined') {
            // this creates an array in the cart based on the product_key and fills the entirety of it with 0
            request.session.cart[product_key] = new Array(quantity_submit.length).fill(0);
        }
        for (i in request.session.cart[product_key]) {
            // this adds the submitted quantities to the array based on the product key
            request.session.cart[product_key][i] += Number(quantity_submit[i]);
        }
    } else {
        params.append('qty_data', JSON.stringify(request.body));
        params.append('qty_errors', JSON.stringify(errors));
    }
    console.log(request.session);
    response.redirect('./products_display.html?' + `${params.toString()}`);
});

app.post("/login.html", function (request, response) {
    let params = new URLSearchParams(request.query);
    let paramsstring = params.toString();
    var errors = {}; // assumes 0 errors at first
    username = request.body['username'].toLowerCase();
    password = request.body['password'];
    //if no username dettected print the follwoing
    if (request.body['username'] == "") {
        errors['username'] = `Please enter your username`;
    }
    if (request.body['password'] == "") {
        errors['password'] = `Please enter your password`;
    }
    if (typeof users_reg_data[username] == 'undefined') {
        errors['username'] = `Username not found`;
        errors['password'] = ` `;
    }
    if (typeof users_reg_data[username] != 'undefined') {
        if (users_reg_data[username].password != password) {
            errors['username'] = ` `;
            errors['password'] = `Password incorrect`;
        }
    }

    // Get errors and check the Errors varieable if no errors put the following in the session 
    if (Object.keys(errors).length == 0) {
        // if there are 0 errors, meaning login works , we take the username, full name and email and put them into the session
        delete errors;
        request.session['username'] = username;
        request.session['email'] = all_user_data[username].email;
        request.session['full_name'] = all_user_data[username].name;
        console.log(request.session);
        response.redirect(`./products_display.html?products_key=Champions`)
    } else {
        // if theres errors, send input and error data back to login page plus qs for products info
        params.append('login_data', JSON.stringify(request.body));
        params.append('login_errors', JSON.stringify(errors));
        response.redirect(`./login.html?${params.toString()}`);
    }
});

// Transfer all releveant information to egaistgeag 
app.post("/reg", function (request, response) {
    let params = new URLSearchParams(request.query);
    response.redirect('./register.html?' + params);
})

//Below are all taken from assignment 2 with the validation stuff just modified and refined nothign too new
app.post("/register.html", function (request, response) {
    let params = new URLSearchParams(request.query);
    console.log(request.body);
    var errors = {};
    // request.body inputs the followign stuff
    username = request.body['username'].toLowerCase(); //UTIlzie lwoercase as a short cut
    password = request.body['password'];
    fullname = request.body['fullname'];
    repeat_password = request.body['repeat_password'];
    email = request.body['email'];
        //Takne from assignemtn2 slighlty modified for reference of code in this body  https://www.dofactory.com/javascript/regular-expressions || https://www.w3schools.com/jsref/jsref_regexp_not_0-9.asp
    if (request.body.username == '') {
        errors['username'] = `You need to enter a username!`;
    }
    // check is username taken
    if (typeof users_reg_data[username] != 'undefined') {
        errors['username'] = `Hey! ${username} is already taken!`;
    }
    // if username meets character length requirement < 4
    if (username.length < 4) {
        errors['username'] = `Username must be longer than 4 characters`;
    }
    // if username meets character length requirement > 10
    if (username.length > 10) {
        errors['username'] = `Username has maximum of 10 characters`;
    }
    // checking for special variables 
    var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+/;
    var special_username = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (username.match(special_username)) {
        errors['username'] = `Username must have letters and numbers only`;
    }
    // Repeating pass?
    if (request.body.password != request.body.repeat_password) {
        errors['password'] = `Repeat password not the same as password!`;
        errors['repeat_password'] = `Repeat password not the same as password!`;
    }
    // check if pass is 6 or less
    if (password.length < 6) {
        errors['password'] = `Password must have a minimum of 6 characters`;
    }
    // check if theres a password input
    if (request.body.password == '') {
        errors['password'] = `You need a password!`;
    }


    //CHECKING EMAIL 


    // taken from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
    } else {
        errors['email'] = `must enter a valid email without special characters`;
    }
    if (fullname.length < 31) {
    } else {
        errors['fullname'] = `Full name must be letters only and less than 30 characters`;
    }
    // if theres 0 errors, write data to reg file, and redirect to invoice
  //else 
    if (Object.keys(errors).length === 0) {
        console.log(errors);
        delete errors;
        users_reg_data[username] = {};
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;
        users_reg_data[username].name = request.body.fullname;
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));
        console.log("Saved User: " + request.body.username);

        request.session['username'] = username;
        request.session['email'] = email;
        request.session['full_name'] = fullname;
        console.log(request.session);
        response.redirect(`./products_display.html?products_key=Champions`);
    } else {
        // code from help with professor port
        params.append('reg_data', JSON.stringify(request.body));
        params.append('reg_errors', JSON.stringify(errors));
        response.redirect(`./register.html?${params.toString()}`);
    }
});

// Taken from assignment 3 code examples if get request is detected get cart
app.post("/get_cart", function (request, response) {
    response.json(request.session.cart);
});

// This is a get to the session data
app.get("/session_data.js", function (request, response, next) {
    response.type('.js');
    // declare a shopping cart if there isn't one
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    //using login information as session string to give each user a unqiue string 
    var session_str = `var user_name = ${JSON.stringify(request.session.username)}; var full_name = ${JSON.stringify(request.session.full_name)}; var user_email = ${JSON.stringify(request.session.email)}; var cart_data = ${JSON.stringify(request.session.cart)};`;
    response.send(session_str);
})

// when log out destroy da session
app.get("/logout", function (request, response, next) {
    request.session.destroy();
    console.log(request.session);
    response.redirect('./');
});

//  process in updating the 
app.post("/cart_update", function (request, response, next) {
    console.log(request.body);
    for (product_key in request.session.cart) {
        for (i in request.session.cart[product_key]) {
            //if zero skip hence continue no need to stop at 0 
            if (request.session.cart[product_key][i] == 0) {
                continue;
            }
            request.session.cart[product_key][i] = Number(request.body[`cart_update_${product_key}_${i}`]);
        }
    }
    console.log(request.session);
    response.redirect("./cart.html");
})

// This is used to process the checkout
app.post("/cart_checkout", function (request, response) {
    //check if login if not print not found 
    if (typeof request.session.username == 'undefined') {
        console.log(`NOt found a username`);
        response.redirect('/cart.html?NotLoggedIn');
    } else {
    console.log(`found a username`);

//Remove items //portion of the code was taken from Zhi Jun, Sean Morris, and Alexandria Lim
    var last_cart = request.session.cart;
    for (product_key in products_data) {
        for ( i = 0; i < products_data[product_key].length; i++) {
            if (typeof last_cart[product_key] == 'undefined') continue;{
                var last_qty = last_cart[product_key][i];
                products_data[product_key][i]['quantity_available'] -= last_qty;
            }
        }
    };

    //HTML invoice string
    var invoice_str = `<span style="display: flex; font-size: large; color: black; justify-content: center; text-align: center;">Thank you for your order ${request.session.full_name}!<br>Happy Holidays!</span><br><table border="2px">
    <thead>
        <th>
            Cards Selected
        </th>
        <th>
            Quantity
        </th>
        <th>
            Price
        </th>
        <th>
            Extended Price
        </th>
    </thead>`;
    var shopping_cart = request.session.cart;
    let subtotal = 0;
    // Code belowwas all borrowed from 3either assignment 2
    let params = new URLSearchParams(request.query);
    // new params session to get total or information to get ready to send out
    if (params.has('total')) {
        var total = params.get('total');
    }
    console.log(total);
    let total_quantity = total;

    for (product_key in products_data) {
        for (i = 0; i < products_data[product_key].length; i++) {
            if (typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if (qty > 0) {
                extended_price = products_data[product_key][i]['price'] * qty;
                subtotal = subtotal + extended_price;
                invoice_str += `<tr>
                <td>
                    ${products_data[product_key][i]['name']}
                </td>
                <td>
                ${qty}
                </td>
                <td>
                    $${products_data[product_key][i]['price']}
                </td>
                <td>$${extended_price.toFixed(2)}</td>
            </tr>`;
            }
        }
    }
    //end of borrow code

    var tax_rate = 0.045;
        var salestax = tax_rate * subtotal;

        // Compute total before shipping
        var check_total = subtotal + salestax;

        // Compute Shipping cost
        var shipping_costs = (total_quantity < 4) ? 30*total_quantity : (total_quantity < 11) ? 25*total_quantity : 15*total_quantity;

        // compute grand total
        var grand_total = check_total + shipping_costs;
        invoice_str += `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        <tr><td class="text-right"><strong>Subtotal</strong><td>&nbsp;</td></td><td>&nbsp;</td><td><strong>$${subtotal.toFixed(2)}</strong></td></tr> 
        
        <tr><td class="text-right"><strong>HI Sales Tax @ 4.5%</strong><td>&nbsp;</td></td><td>&nbsp;</td><td><strong>$${salestax.toFixed(2)}</strong></td></tr> 

        <tr><td class="text-right"><strong>Shipping</strong><td>&nbsp;</td></td><td>&nbsp;</td><td><strong>$${shipping_costs.toFixed(2)}</strong></td></tr>

        <tr><td class="text-right"><strong>Grand Total</strong><td>&nbsp;</td></td><td>&nbsp;</td><td><strong>$${grand_total.toFixed(2)}</strong></td></tr>
        
        </table>`;

    // Ref https://mailtrap.io/blog/nodemailer-gmail/
    var user_email = request.session.email;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '2019pangj@kalanihs.org',
            pass: 'ShurimaFirefly'
        }
      });
      
      const mailOptions = {
        from: 'noreply@Runeterra.com',
        to: user_email,
        subject: `Thank You for Your Order ${request.session.full_name}`,
        html: invoice_str
      };
      //i there is error print thing in the following email  and then there sthe option to exit out
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.redirect(`./invoice.html`);
      });
    };

})
//exit invoice and go back home
app.post("/exitinvoice", function (request, response) {
    console.log('got the exit');
    request.session.cart = {};
    console.log(request.session.cart);
    response.redirect('./index.html');
})

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

// Function used to check incoming quantities are NonNegInt
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}