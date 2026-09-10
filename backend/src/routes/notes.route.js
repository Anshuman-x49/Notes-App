import express from "express";
import {
  addNoteController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
  isFavNoteController,
} from "../controllers/notes.controller.js";

const router = express.Router();

// CREATE
router.post('/add-note', addNoteController);

// READ
router.get('/get-notes', getAllNotesController);
router.get('/get-note/:id', getSingleNoteController);

// UPDATE
router.put('/update-note/:id', updateNoteController);

// DELETE
router.delete('/delete-note/:id', deleteNoteController);

// Fav note
router.put('/fav-note/:id', isFavNoteController);

export default router;