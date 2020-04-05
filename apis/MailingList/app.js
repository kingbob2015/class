const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const mailchimpApiKey = "fb84ce57c57b5c46e7ea052154f724c9-us19";
  const mailchimpListId = "e73d196e3a";

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ],
    update_existing: true
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us19.api.mailchimp.com/3.0/lists/${mailchimpListId}`;
  const options = {
    method: "POST",
    auth: `foo:${mailchimpApiKey}`
  };
  const request = https.request(url, options, response => {
    response.on("data", data => {
      const code = response.statusCode;
      if (code === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
