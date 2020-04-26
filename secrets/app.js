require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
mongoose.set("useCreateIndex", true)

//Has to be mongoose schema to use plugins
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/auth/google", (req, res) => {
    passport.authenticate("google", { scope: ["profile"] })(req, res)
})

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/secrets');
    });

app.route("/submit")
    .get((req, res) => {
        //Accessing the req.isAuthenticated requires cookies being set for the session
        if (req.isAuthenticated()) {
            res.render("submit");
        } else {
            res.redirect("/login")
        }
    })
    .post((req, res) => {
        const submittedSecret = req.body.secret;

        User.findById(req.user.id, (err, foundUser) => {
            if (err) {
                console.log(err)
            } else {
                if (foundUser) {
                    foundUser.secret = submittedSecret
                    foundUser.save(() => {
                        res.redirect("/secrets")
                    })
                }
            }
        })
    })
//Login and register routes only used when Google button is not the method
app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, (err) => {
            if (err) {
                console.log(err);
            } else {
                //I think login finds the user in the DB and lets them through regardless of password
                //Login is also what sets the session id cookie
                //At this point the authenticate method actually checks the password
                //Authenticate does not need the cookie set but upstream may
                passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets")
                })
            }
        })
    })

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, () => {
                    //Only gets called if the user gets authenticated
                    res.redirect("/secrets");
                })
            }
        })
    })

app.get("/secrets", (req, res) => {
    User.find({ "secret": { $ne: null } }, (err, foundUsers) => {
        if (err) {
            console.log(err)
        } else {
            if (foundUsers) {
                res.render("secrets", { usersWithSecrets: foundUsers })
            }
        }
    })
})

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});