const express = require("express");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const router = express.Router({ mergeParams: true });
module.exports = router;

const validateReview = (req, _, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

router.get(
  "/:reviewId/delete",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted the review.");
    res.redirect(301, `/campground/${id}`);
  })
);

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const review = new Review({ ...req.body.review });
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new review.");
    res.redirect(301, `/campground/${campground._id}`);
  })
);
