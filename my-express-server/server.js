const express = require('express');
const app = express();

app.get("/", function(req, res){
    res.send("<h1>Hello</h1>");
});

app.get("/contact", function(req, res){
    res.send("Contact me at kingbob2015@hotmail.com");
});

app.get("/about", function(req, res){
    res.send("<h1>FEAR ME I AM BOB KING</h1>");
});

app.get("/hobbies", function(req, res){
    res.send("<h1>Beer</h1>");
});

app.listen(3000, function() {
    console.log("server started on port 3000");
});