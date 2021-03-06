var express                 = require("express"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");
    

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I want a stable job with good salary",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =================================
// ROUTES
// =================================
app.get("/",function(req, res){
    res.render("home");
});
app.get("/secret", isLoggedIn,function(req,res){
    res.render("secret");
});

// =================================
// SHOW SIGN UP FORM
// =================================
app.get("/register",function(req,res){
    res.render("register");
});

// =================================
// HANDLING USER SIGN UP
// =================================
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
        } 
        passport.authenticate("local")(req, res, function(){
            res.render("login");
        });
    });
});

// =================================
// LOGIN ROUTES
// =================================
app.get("/login", function(req,res){
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }), function(req,res){   
});

// =================================
// LOGOUT ROUTES
// =================================
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// =================================
// "IS LOGGED IN" FUNCTION
// =================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// =================================
// SERVER
// =================================
app.listen(3000, function(){
    console.log("SERVER HAS STARTED!");
});