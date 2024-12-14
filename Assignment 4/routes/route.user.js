const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const { User } = require("../model/user.model"); // Import your User model
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email.js");
const {
  sessionMiddleware,
  setUserSession,
  deleteUserSession,
} = require("../util/cookie.js");
router.get("/user-signup", (req, res) => {
  if (req.session.userEmail) {
    return res.redirect("/"); // Redirect if not logged in
  }
  res.render("signup");
});
router.get("/user-login", (req, res) => {
  console.log(req.session.userEmail);
  if (req.session.userEmail) {
    return res.redirect("/"); // Redirect if not logged in
  }
  res.render("login");
});

router.post("/user-signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send("All fields are required.");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with that email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpire: Date.now() + 3600000,
    });
    await newUser.save();

    console.log("Session before setting:", req.session);
    req.session.userEmail = newUser.email;
    req.session.userRole = newUser.role;

    req.session.isLoggedIn = true;

    if (req.session.userId) {
      return res.redirect("/"); // Redirect to login if not logged in
    }

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(200).redirect("/verify-email");
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    res.status(500).send("An error occurred during sign-up.");
  }
});

router.post("/verify-code", async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).redirect("/");
  } catch (error) {
    console.log("error in verifyEmail ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password using bcryptjs
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    console.log("Role", user.role);
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.isLoggedIn = true;

    user.lastLogin = new Date();
    await user.save();

    res.status(200).redirect("/");
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});
router.get("/user-logout", async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid"); // Clearing the session cookie
    res.status(200).redirect("/");
  });
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 36000000); // Adds 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract token from request parameters
    const { password } = req.body;

    // Log the token received from the frontend
    console.log("Token received from frontend:", token);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Proceed with resetting the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = router;
