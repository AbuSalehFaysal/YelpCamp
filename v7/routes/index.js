const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// =======================
// ROOT ROUTE
// =======================
router.get("/", function (req, res) {
  res.render("landing", { currentUser: req.user });
});

// =======================
// SHOW REGISTER FORM
// =======================
router.get("/register", function (req, res) {
  res.render("register");
});

// =======================
// HANDLING SIGN UP LOGIC
// =======================
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds");
    });
  });
});

// =======================
// SHOW LOGIN FORM
// =======================
router.get("/login", function (req, res) {
  res.render("login");
});

// =======================
// HANDLING LOGIN LOGIC
// =======================
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// =======================
// LOGOUT ROUTE
// =======================
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/campgrounds");
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

module.exports = router;
