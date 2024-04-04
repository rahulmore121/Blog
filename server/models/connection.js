const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log("failed to connect", error);
  }
};
