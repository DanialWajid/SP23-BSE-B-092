const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
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
    req.session.cart = req.session.cart || [];

    req.session.isLoggedIn = true;

    if (req.session.userId) {
      return res.redirect("/"); // Redirect to login if not logged in
    }
    if (newUser.email == "danialwajid112@gmail.com") {
      await sendVerificationEmail(newUser.email, verificationToken);
    }

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

    console.log("hello", user?.verificationToken); // Correctly log the user's verificationToken
    console.log("code", code); // Log the provided code from the request

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Save the user if needed (you might not need this if you're not modifying user here)
    await user.save();

    if (user.email === "danialwajid112@gmail.com") {
      // Pass the user's verification token as the second argument to the email function
      await sendWelcomeEmail(user.email, user.verificationToken);
    }

    // Set the user verification status and clean up the token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    // Save the user again after modifying their verification status
    await user.save();

    res.status(200).redirect("/"); // Redirect after successful verification
  } catch (error) {
    console.log("error in verify-Email ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  try {
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
    req.session.cart = req.session.cart || [];

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
    res.clearCookie("connect.sid");
    res.status(200).redirect("/user-login");
  });
});

router.get("/admin/user-forgot-password", async (req, res) => {
  res.render("forgot-password");
});
router.get("/admin/reset-sent", (req, res) => {
  res.render("reset-sent"); // This will render the "reset-sent" EJS file (or any other template engine you are using)
});

router.post("/admin/user-forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 36000000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendResetPasswordEmail(
      user.email,
      `http://localhost:5001/user/reset-password/${resetToken}`
    );

    res.status(200).redirect("/admin/reset-sent");
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});
router.get("/user/reset-password/:token", async (req, res) => {
  const resetToken = req.params.token;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).render("invalid-token");
    }

    res.render("reset-password", { token: resetToken });
  } catch (error) {
    console.log("Error fetching user for reset password:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/user/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params; // Extract token from request parameters
    const { password } = req.body;

    // Log the token received from the frontend
    console.log("Token received from frontend:", token);
    console.log("Password received from frontend:", password);

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
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.redirect("/user-login");
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
});

module.exports = router;