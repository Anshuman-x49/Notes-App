require("./config/config");
const app = require("./app");
const connectDB = require("./config/db");

await connectDB();

app.listen(config.port, async () => {
  console.log(`Server is running on ${config.port}`);
});
