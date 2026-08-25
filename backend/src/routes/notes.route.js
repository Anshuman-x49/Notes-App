const express = require("express");
const { addNoteController, getAllNotesController, getSingleNoteController, updateNoteController, deleteNoteController, isFavNoteController } = require("../controllers/notes.controller");


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

module.exports = router;