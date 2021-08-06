const express = require("express");
const passport = require("passport");

const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();
module.exports = router;

router.get("/register", (_, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    await User.register(user, password);
    req.flash("success", "Welcome to Yelp Camp!");
    res.redirect(301, "/campgrounds");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(301, "/register");
  }
});

router.get("/login", (_, res) => res.render("users/login"));

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(301, "/campgrounds");
  }
);
