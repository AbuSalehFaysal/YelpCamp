const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//==============================
// INDEX - SHOW ALL CAMPGROUNDS
//==============================
router.get("/", function (req, res) {
  //GET ALL CAMPGROUND FROM DB
  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allcampgrounds,
        currentUser: req.user,
      });
    }
  });
});

//==========================================
// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
//==========================================
router.get("/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

// =============================================
// CREATE - ADD NEW CAMPGROUNDS TO THE DATABASE
// =============================================
router.post("/", isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: description, author: author };
  // campgrounds.push(newCampground);
  //CREATE A NEW CAMPGROUND and SAVE TO DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      console.log("Successfully added!");
      res.redirect("/campgrounds");
    }
  });
});

// =====================================
// SHOW - MORE INFO FROM ONE CAMPGROUND
// =====================================
router.get("/:id", function (req, res) {
  //find the campground with provide id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// =====================================
// EDIT CAMPGROUND
// =====================================
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground}); 
  });
});

// =====================================
// UPDATE CAMPGROUND
// =====================================
router.put("/:id", function(req, res){
  // FIND AND UPDATE AND REDIRECT TO THE SHOW PAGE
  var data = 
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

// =====================================
// DESTROY CAMPGROUND
// =====================================
router.delete("/:id", function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// =================================
// "IS LOGGED IN" MIDDLEWARE
// =================================
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground){
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // does user own the campground
        console.log(foundCampground.author.id);
        console.log(req.user._id);
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    console.log("YOU NEED TO BE LOGGED IN");
    res.redirect("back");
  }
}

module.exports = router;
