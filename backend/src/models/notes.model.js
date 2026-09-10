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
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
        index : true,
    }
});

const notesModel = mongoose.model("note", noteSchema);

export default notesModel;