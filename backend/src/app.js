const express = require("express");
const cors = require("cors");
const app = express();
const notesRouter = require("./routes/notes.route");

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);


module.exports = app;