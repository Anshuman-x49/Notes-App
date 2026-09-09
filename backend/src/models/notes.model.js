import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        minlength : 10,
    },
    isFavorite : {
        type : Boolean,
        default : false,
    }
});

const notesModel = mongoose.model("notes", noteSchema);

export default notesModel;