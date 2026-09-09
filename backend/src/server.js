import app from "./app/app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";

try {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server is running on ${config.port}`);
  });
} catch (err) {
  console.error("Error starting server:", err);
  process.exit(1);
}
