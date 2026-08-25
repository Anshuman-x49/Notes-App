require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  connectDB();
  console.log(`Server is running on ${port}`);
});
