const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const notesRouter = require("./routes/notes.route");

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/notes", notesRouter);

// Serve frontend static build
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// SPA fallback — serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;