const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

seedDB();

// =======================
// PASSPORT CONFIGURATION
// =======================
app.use(require("express-session")({
  secret: "Abu Saleh Faysal",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp_v6");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function (req, res) {
  res.render("landing", {currentUser: req.user});
});

// INDEX - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function (req, res) {
  //GET ALL CAMPGROUND FROM DB
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
    }
  });
});

// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function (req, res) {
  res.render("campgrounds/new");
});

// CREATE - ADD NEW CAMPGROUNDS TO THE DATABASE
app.post("/campgrounds", function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = { name: name, image: image, description: description };
  // campgrounds.push(newCampground);
  //CREATE A NEW CAMPGROUND and SAVE TO DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully added!");
      res.redirect("/campgrounds");
    }
  });
});

//SHOW - MORE INFO FROM ONE CAMPGROUND
app.get("/campgrounds/:id", function (req, res) {
  //find the campground with provide id
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});



// =================================
// COMMENTS ROUTES 
// =================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
  // lookup campfround using id 
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err,comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// =======================
// AUTH ROUTES
// =======================

// =======================
// SHOW REGISTER FORM
// =======================
app.get("/register", function(req, res){
  res.render("register");
});

// =======================
// HANDLING SIGN UP LOGIC
// =======================
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// =======================
// SHOW LOGIN FORM
// =======================
app.get("/login", function(req, res){
  res.render("login");
});

// =======================
// HANDLING LOGIN LOGIC
// =======================
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
  }), function(req, res){
});

// =======================
// LOGOUT ROUTE
// =======================
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
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

app.listen(3000, function () {
  console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);
