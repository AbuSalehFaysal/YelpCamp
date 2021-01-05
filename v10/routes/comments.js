const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// =================================
// NEW COMMENTS FORM
// =================================
router.get("/new", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// =================================
// CREATE COMMENT
// =================================
router.post("/", isLoggedIn, function (req, res) {
  // lookup campfround using id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// =================================
// EDIT COMMENT
// =================================
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});      
    }
  });
});

// =================================
// UPDATE COMMENT
// =================================
router.put("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      console.log(err);
      res.render("back");
    } else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

// =================================
// DESTROY COMMENT
// =================================
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err){
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/"+req.params.id);
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

// ========================================
// "CHECK COMMENT OWNERSHIP" MIDDLEWARE
// ========================================
function checkCommentOwnership(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        // does user own the comment
        console.log(foundComment.author.id);
        console.log(req.user._id);
        if (foundComment.author.id.equals(req.user._id)) {
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
