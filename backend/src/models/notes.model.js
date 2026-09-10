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
}, { timestamps: true });

// Compound indexes for efficient user-scoped queries
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isFavorite: 1 });

const notesModel = mongoose.model("note", noteSchema);

export default notesModel;