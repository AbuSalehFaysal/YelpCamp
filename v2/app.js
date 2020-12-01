const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Sajek",
//     image:
//       "https://avijatrik.org/wp-content/uploads/2019/06/cover22-870x555.jpg",
//     description: "This is my favorite place to visit!",
//   },
//   function (err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Campground Created succesfully!");
//       console.log(campground);
//     }
//   }
// );

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
      res.render("index", { campgrounds: allcampgrounds });
    }
  });
});

// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function (req, res) {
  res.render("new");
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
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(3000, function () {
  console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);
