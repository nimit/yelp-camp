const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

const configMongoose = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Mongoose Connected.");
  } catch (err) {
    console.log(`Mongoose error occured.\n${err}`);
  }
};

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.ceil(Math.random() * 20) + 10;
    const camp = new Campground({
      name: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "http://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At provident dignissimos quibusdam dicta fugiat in iusto ut quos quisquam nihil tempora ipsum ipsam inventore tenetur, laborum non unde labore sed!",
      price,
    });
    await camp.save();
  }
};

const initDB = async () => {
  try {
    await configMongoose();
    await seedDB();
    await mongoose.connection.close();
  } catch (err) {
    console.log(`Error Occured.\n${err}`);
    await mongoose.connection.close();
  }
};

initDB();
