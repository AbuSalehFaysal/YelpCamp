const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing")
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Shahriar Kabir", image: "https://images.pexels.com/photos/2108709/pexels-photo-2108709.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "Mohammad Shuvo", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "Zannatun Nayeem", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
    ]
    res.render("campgrounds",{campgrounds: campgrounds});
});

app.listen(3000, function(){
    console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);