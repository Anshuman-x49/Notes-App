require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const notesModel = require("./models/notes.model");

connectDB();

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
})

app.post("/addnote", async (req, res) => {
  const { title, description, isFavorite } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "All field required",
    });
  }

  const newNote = await notesModel.create({
    title,
    description,
    isFavorite: Boolean(isFavorite),
  });

  return res.status(201).json({
    message: "Note created successfully",
    newNote,
  });
});

app.get("/getnotes", async (req, res) => {
  const allNotes = await notesModel.find();

  return res.status(200).json({
    message: "Notes fetched successfully",
    allNotes,
  });
});

app.get("/getnote/:id", async (req, res) => {
  const singleNote = await notesModel.findById(req.params.id);

  if (!singleNote) {
    return res.status(404).json({
      message: "Note not found",
    });
  }

  return res.status(200).json({
    message: "Notes fetched successfully",
    singleNote,
  });
});

app.delete("/deletenote/:id", async (req, res) => {
  try {
    const deleteNote = await notesModel.findByIdAndDelete(req.params.id);

    if (!deleteNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note Deleted Successfully",
      id: req.params.id,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});




app.put("/updatenote/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, isFavorite } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;

    const updatedNote = await notesModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    return res.status(200).json({
      message: "Note updated successfully",
      updatedNote
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
})

// SPA fallback: serve index.html for all remaining routes in Express 5
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

module.exports = app;