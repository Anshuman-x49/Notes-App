import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokenHash: {
    type: String
  }
}, 
{
  timestamps: true
});

const userModel = mongoose.model("User", UserSchema);
export default userModel;