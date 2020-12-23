const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");

seedDB();

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp_v4");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("landing");
});

// INDEX - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function (req, res) {
  //GET ALL CAMPGROUND FROM DB
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allcampgrounds });
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

app.post("/campgrounds/:id/comments", function(req,res){
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
  // create new comment 
  //connect new comment to campground 
  // redirect campground show page
})

// =================================
// COMMENTS ROUTES 
// =================================

app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.listen(3000, function () {
  console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);
