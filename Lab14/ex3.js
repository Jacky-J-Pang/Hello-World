var fs = require ('fs');
var express = require('express');
var app = express();

var filename = './registration_data.dat';

if(fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats["size" + 'characters'])
    // have reg data file, so read data and aprse into the user registration_info object
    let data_str = fs.readFileSync(filename, 'utf-8')
    var user_registration_info =  require(filename);
    console.log(user_registration_info);

} else{
    console.log(filename + 'does not exist!')
}

app.get("/", function(request, response){
    response.send('nothing here');
});

app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
// Give a simple login form
str =`
<body>
‹form action="'" method-"POST'>
input type-"text" name-"username" size="40" placeholder-"enter username"›br />
input type="password" name-"password" size="40" placeholder-"enter password">br />
input type="submit" value-"Submit* id-"submit">
</form>
</bodys>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    let login_username = request.body['username'];
    let login_password = request.body['password'];
    //check if username exist
    if (typeof user_registration_info[login_username] != 'undefined'){
        if(user_registration_info[login_username]["password"] == login_password)
            response.send(`${login_username} is logged in`);
    } else {
        response.redirect(`./login?err=incorrect password for ${login_username}`);
    }
            
    }
  
  );

  app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
    <form action="" method="POST">
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
    // process a regieration

    //validate registration data()

    //all good save the new user 
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;
    
    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    response.send(`${username} registered!`)
 });
app.listen(8080, () => console. log ( `Listening on port 8080` ));
