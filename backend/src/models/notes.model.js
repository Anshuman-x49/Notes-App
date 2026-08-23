const { default: mongoose } = require("mongoose");

const noteSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        minlength : 10,
    }
}) 

const notesModel = mongoose.model("notes",noteSchema)

module.exports = notesModel