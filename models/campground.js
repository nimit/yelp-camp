const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const campgroundSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  image: { type: String },
  location: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async (camp) => {
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;
