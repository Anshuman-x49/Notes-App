const { default: mongoose } = require("mongoose");
const config = require("./config");

async function connectDB() {
  try {
    await mongoose.connect(config.db_url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error Ocurred", error);
  }
}

module.exports = connectDB;
