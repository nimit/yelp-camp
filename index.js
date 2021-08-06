const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const User = require("./models/user");

const app = express();

const configExpress = () => {
  app.engine("ejs", ejsMate);
  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "ejs");
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "static")));
  const sessionOptions = {
    secret: "secretkey101",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  app.use(session(sessionOptions));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
};

const configMongoose = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Mongoose Connected.");
  } catch (err) {
    console.log(`Mongoose error occured.\n${err}`);
  }
};

const configPassport = () => {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

configExpress();
configMongoose();
configPassport();

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (_, res) => res.render("home"));

app.use("/", campgroundRoutes);

app.use("/campground/:id/review", reviewRoutes);

app.use("/", userRoutes);

app.all("*", (_, __, next) => {
  next(new ExpressError(404, "Page Not Found."));
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Something went wrong!", stack } = err;
  res.status(status).render("error", { message, stack });
});

app.listen(3000, () => console.log("Express app running on port 3000!"));
