import notesModel from "../models/notes.model.js";

// Create note controller
export const addNoteController = async (req, res) => {
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
      user: req.user.id,
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
export const getAllNotesController = async (req, res) => {
  try {
    const allNotes = await notesModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

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
export const getSingleNoteController = async (req, res) => {
  try {
    const singleNote = await notesModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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
export const updateNoteController = async (req, res) => {
  try {
    const body = req.body;

    const note = await notesModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      body,
      { new: true, runValidators: true }
    );

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
export const deleteNoteController = async (req, res) => {
  try {
    const deleteNote = await notesModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

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
export const isFavNoteController = async (req, res) => {
  try {
    const isFavNote = await notesModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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
