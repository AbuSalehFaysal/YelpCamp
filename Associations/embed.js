const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp");

// POST - title, content 
var postSchema = new mongoose.Schema({
    title: String, 
    content: String 
});

var Post = mongoose.model("Post", postSchema);

// var newPost = new Post({
//     title: "Biyebari manei borhani",
//     content: "Borhani is tasty"
// });
// newPost.save(function(err, post){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });

// USER - email, name 
var userSchema =  new mongoose.Schema({
    email: String,
    name: String, 
    posts: [postSchema]  
});

var User = mongoose.model("User", userSchema);

// var newUser = new User({
//     email: "abusalehfaysal222@gmail.com",
//     name: "Abu Saleh Faysal"
// });

// newUser.posts.push({
//     title: "Biyebari manei borhani",
//     content: "Borhani is tasty"
// });
 
// newUser.save(function(err, user){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

User.findOne({name: "Abu Saleh Faysal"}, function(err, user){
    if (err) {
        console.log(err);
    } else {
        user.posts.push({
            title: "Biyebari manei biriyani",
            content: "biriyani is tasty"
        });
        console.log(user);        
    }
});