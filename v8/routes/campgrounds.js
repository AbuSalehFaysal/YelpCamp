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
router.get("/new", function (req, res) {
  res.render("campgrounds/new");
});

// =============================================
// CREATE - ADD NEW CAMPGROUNDS TO THE DATABASE
// =============================================
router.post("/", function (req, res) {
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

module.exports = router;
