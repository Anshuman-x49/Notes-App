import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    await mongoose.connect(config.db_url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error Ocurred", error);
  }
}

export default connectDB;
