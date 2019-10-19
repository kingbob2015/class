var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/bmicalculator", function(req, res){
    var h = parseFloat(req.body.height);
    var w = parseFloat(req.body.weight);

    h = h/100;

    var bmi = w/(Math.pow(h, 2));
    res.send("Your BMI is " + bmi)
});

app.listen(3000);