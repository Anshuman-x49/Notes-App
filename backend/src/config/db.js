const { default: mongoose } = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error Ocurred", error);
  }
}

module.exports = connectDB;
