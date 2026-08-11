const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../model/adminData");

const JWT_SECRET = "Secret1234";

const emailRegex = /\S+@\S+\.\S+/;
const indianPhoneRegex = /^(?:(?:\+|00)91[\s-]*)?[6-9]\d{9}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

const signUp = async (req, res) => {
  const { name, email, phone, password } = req.body;

  let errors = {};

  // check existing
  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      errors: { email: "Email already registered" }
    });
  }

  // validations
  if (!name) errors.name = "Enter name";

  if (!email) {
    errors.email = "Enter email";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email";
  }

  if (!phone) {
    errors.phone = "Enter phone";
  } else if (!indianPhoneRegex.test(phone)) {
    errors.phone = "Invalid phone";
  }

  if (!password) {
    errors.password = "Enter password";
  } else if (!passwordRegex.test(password)) {
    errors.password = "Min 8 chars, include letter & number";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    // 🔐 create token
    const token = jwt.sign(
      { id: adminUser._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ❌ remove password before sending
    const userResponse = {
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone
    };

    res.status(201).json({
      message: "Registered Successfully",
      success: true,
      user: userResponse,
      token
    });

  } catch (error) {
    console.log("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({
        errors: { email: "User not found" }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: { password: "Invalid password" }
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 1. Get Profile Details
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ success: true, user: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Update Profile Details
const updateProfile = async (req, res) => {
  const { name, email, phone, avatarUrl, role } = req.body;
  let errors = {};

  if (!name) errors.name = "Enter name";

  if (!email) {
    errors.email = "Enter email";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email";
  }

  if (!phone) {
    errors.phone = "Enter phone";
  } else if (!indianPhoneRegex.test(phone)) {
    errors.phone = "Invalid phone";
  }

  // Validate role enum
  if (role && !["admin", "manager"].includes(role)) {
    errors.role = "Role must be either admin or manager";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const emailExists = await Admin.findOne({ email, _id: { $ne: req.user.id } });
    if (emailExists) {
      return res.status(400).json({ errors: { email: "Email already registered by another account" } });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, avatarUrl, role: role || "admin" },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      success: true,
      user: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { signUp,logIn,getProfile,updateProfile };