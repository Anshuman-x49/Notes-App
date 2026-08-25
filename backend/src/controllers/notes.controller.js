const notesModel = require("../models/notes.model");

// Create note controller
const addNoteController = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "All Fields Required",
      });
    }

    const newNote = await notesModel.create({
      title,
      description,
    });

    return res.status(201).json({
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all notes controller
const getAllNotesController = async (req, res) => {
  try {
    const allNotes = await notesModel.find();

    return res.status(200).json({
      message: "Notes fetched successfully",
      data: allNotes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single note controller
const getSingleNoteController = async (req, res) => {
  try {
    const singleNote = await notesModel.findById(req.params.id);

    if (!singleNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    return res.status(200).json({
      message: "Note fetched successfully",
      data: singleNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update note controller
const updateNoteController = async (req, res) => {
  try {
    const body = req.body;

    const note = await notesModel.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    return res.status(200).json({
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete note controller
const deleteNoteController = async (req, res) => {
  try {
    const deleteNote = await notesModel.findByIdAndDelete(req.params.id);

    if (!deleteNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json({
      message: "Note deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// IsFavorite Note controller
const isFavNoteController = async (req, res) => {
  try {
    const isFavNote = await notesModel.findById(req.params.id);

    if (!isFavNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    isFavNote.isFavorite = !isFavNote.isFavorite;

    await isFavNote.save();

    return res.status(200).json({
      message: "Note updated successfully",
      data: isFavNote,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {
  addNoteController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
  isFavNoteController,
};
