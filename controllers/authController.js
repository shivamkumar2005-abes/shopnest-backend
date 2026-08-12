const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendemail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    if (user) {
      const message = `Welcome to Shopnest! Your OTP for account verification is: ${otp}. It expires in 10 minutes.`;

      await sendEmail(email, "Welcome to Shopnest - Your OTP for registration", message);

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        message: "Registered successfully. Please check your email for the OTP to verify your account.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found, please request a new one" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired, please request a new one" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      message: "Account verified successfully",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const message = `Your new OTP for Shopnest account verification is: ${otp}. It expires in 10 minutes.`;
    await sendEmail(email, "Shopnest - Your new OTP", message);

    res.json({ message: "A new OTP has been sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.verified) {
        return res.status(403).json({ message: "Please verify your email before logging in" });
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = { registerUser, loginUser, getUsers, verifyOtp, resendOtp };