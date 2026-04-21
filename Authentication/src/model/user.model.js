import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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

  // password:{
  //   type: String,
  //   googleId: String,
  // },

  isverified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verificationToken:String,
  resetToken:String,
  resetTokenExpiry:String,

  role:[{type: String, enum: ["user", "admin"], default: "user"}]
},
{
    timestamps: true,
});   

export const User = mongoose.model("User", userSchema);