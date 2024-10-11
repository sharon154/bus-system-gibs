const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB Database at ${mongoose.connection.host}`.bgGreen.black);
  } catch (error) {
    console.log(`MongoDB Connection Error : ${error}`.bgRed.white);
  }
};

module.exports = connectDB;