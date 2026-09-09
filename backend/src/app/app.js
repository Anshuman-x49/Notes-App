const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser")


const app = express();
const authRouter = require("../routes/auth.route");
const notesRouter = require("../routes/notes.route");


app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRouter);  // authentication routes

app.use("/api/notes", notesRouter); // notes routes


// Serve frontend static build
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));


// SPA fallback — serve index.html for all non-API routes
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;