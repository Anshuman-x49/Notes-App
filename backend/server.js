require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on ${port}`);
});
