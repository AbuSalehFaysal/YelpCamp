var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/friends", {useUnifiedTopology: true, useNewUrlParser: true});
var friendSchema = new mongoose.Schema({
    name: String,
    age: Number,
    category: String
});

var Friend = mongoose.model("Friend", friendSchema);

//adding new cat to the database
// var shahriar = new Friend({
//     name: "Nayeem",
//     age: "24",
//     category: "College"
// });

// shahriar.save(function(err, friend){
//     if(err){
//         console.log("something went wrong");
//     }else{
//         console.log("data saved!");
//         console.log(friend);
//     }
// });
Friend.create({
    name: "Rumu",
    age: 24,
    category: "University"
}, function(err, friend){
    if(err){
        console.log(err);
    }else{
        console.log("friend added!");
        console.log(friend);
    }
});

//retrieve all cats from database
Friend.find({}, function(err, friends){
    if(err){
        console.log("Error!");
        console.log(err);
    }else{
        console.log("ALL THE FRIENDS!!!");
        console.log(friends);
    }
});
