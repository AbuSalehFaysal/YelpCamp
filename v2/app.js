const express    = require("express");
      app        = express();
      bodyParser = require("body-parser");
      mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/db_yelpCamp", {useUnifiedTopology: true, useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

//DATABASE MANUPULATION
// Campground.create(
//     {
//         name: "Rangamati",
//         image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("Campground Added!!!");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing")
});

app.get("/campgrounds", function(req, res){
    //GET ALL CAMPGROUNDS
    Campground.find({},function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds",{campgrounds: allCampgrounds});
        }
    });
    // res.render("campgrounds",{campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    //CREATE A NEW CAMPGROUND AND SAVE IT TO DATABASE
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.listen(4000, function(){
    console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);