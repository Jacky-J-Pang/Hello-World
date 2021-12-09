var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
const { exit } = require('process');
var cookieParser = require('cookie-parser');
var session = require('express-session');


app.use(cookieParser());
app.use(session({secret: "ITM352 rocks!", saveUninitialized: false, resave: false}));



app.use(myParser.urlencoded({ extended: true }));

var filename = "user_data.json";

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');
    //console.log("Success! We got: " + data);

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);
} else {
    console.log("Sorry can't read file " + filename);
    exit();
}

app.get("/use_session", function (request, response) {
    //Print the value of the session ID
    response.send(`Welcome. Your session ID is ${request.session.id}`);
});

//storing data in session between requests
app.get('/', function (req, res) {
    if (req.session.page_views) {
        req.session.page_views++;
        console.log(req.session);
        if (req.session.username) {
            user = req.session.username;
        }
        else {
            user = "Not logged in";
        }
        res.send(`Welcome back ${user}. This is visit # ${req.session.page_views}`);
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});

app.get("/set_cookie", function (request, response) {
    //Sets a cookie called myname with my name inside
    response.cookie('myname', 'Zijun Liu', {maxAge: 10000}).send('cookie set');
});

app.get("/use_cookie", function (request, response) {
    //use cookie if it has been set
    output = "No myname cookie found"
    if (typeof request.cookies.myname != 'undefined'){
        output = `Welcome to the USE cookie page ${request.cookies.myname}`;
    }
    response.send(output);
});

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="/login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST login request");
    POST = request.body;
    user_name_from_form = POST["username"];
    console.log(user_data[0]);
    
    console.log("User name from form=" + user_name_from_form);
    if (user_data[user_name_from_form] != undefined) {
        //response.send(`<H3> User ${POST["username"]} logged in`);
        if (typeof request.session.last_login != 'undefined'){
        var msg = `you last logged in at ${request.session.last_login}`;
        var now = new Date();
    }else{
        var msg = '';
        var now = 'first visit';
    }
    request.session.last_login = now;
    response.send(`${msg}<BR>${user_name_from_form} logged in at ${now}`);
    } else {
        response.send(`Sorry Charlie!`);
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="/register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    POST = request.body;
    console.log("Got register POST");
    if (POST["username"] = !undefined && POST['password'] != undefined && POST['password'] == POST['repeat_password']) {          // Validate user input

        username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.redirect('/login');
    }else{
        response.redirect('/register');
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));