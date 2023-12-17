require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    console.log(`🎯 MongoDB connected with ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
