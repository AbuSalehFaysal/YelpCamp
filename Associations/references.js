const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/blog_demo_2");

var Post = require("./models/post");
var User = require("./models/user");



Post.create({
    title: "How to cook part 2",
    content: "burger"
}, function(err, post){
    if (err) {
        console.log(err);
    } else {
        User.findOne({email: "asfaysal.bracu@gmail.com"}, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            foundUser.posts.push(post);
            foundUser.save(function(err, data){
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        }
    });
    }
});

// User.findOne({email: "Abu Saleh Faysal"}).populate("posts").exec(function(err,user){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

// User.create({
//     email: "asfaysal.bracu@gmail.com",
//     name: "Abu Saleh Faysal"
// });

