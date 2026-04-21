import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const sendEmail = (email, link) => {
  console.log(`Sending email to ${email} with link: ${link}`);
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const token = crypto.randomBytes(32).toString("hex");
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verificationToken: token,
  });

  await newUser.save();

  //verification link
  const link = `http://localhost:3000/auth/verify?token=${token}`;
  sendEmail(email, link);
  res
    .status(201)
    .json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
};

export const verifyEmail = async (req, res) => {
    const token = req.query.token;

    const user = await User.findOne({verificationToken: token})

    if(!user){
        return res.status(400).json({message:"invalid token"})
    }

    user.isverified = true;
    user.verificationToken = null;
    await user.save();
    
    res.status(200).json({message:"Email verified"})
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!user.isverified) {
    return res.status(400).json({ message: "Please verify your email first" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();

  const link = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

  sendEmail(email, link);

  res.status(200).json({
    message: "Password reset link sent to your email",
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};