const express = require("express");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const router = express.Router();
module.exports = router;

const validateCampground = (req, _, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

router.get(
  "/campgrounds",
  catchAsync(async (_, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/campgrounds/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You should be signed in!");
    return res.redirect(301, "/login");
  }
  res.render("campgrounds/new");
});

router.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    const camp = Campground({ ...req.body.campground });
    await camp.save();
    req.flash("success", "Successfully created a campground!");
    res.redirect(301, `/campground/${camp._id}`);
  })
);

router.get(
  "/campground/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground.");
      res.redirect(301, "/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/campground/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated the campground.");
    res.redirect(301, `/campground/${req.params.id}`);
  })
);

router.get(
  "/campground/:id/delete",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Deleted the campground.");
    res.redirect(301, "/campgrounds");
  })
);

router.get(
  "/campground/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground.");
      res.redirect(301, "/campgrounds");
    }
    campground.reviews.reverse();
    res.render("campgrounds/show", { campground });
  })
);
