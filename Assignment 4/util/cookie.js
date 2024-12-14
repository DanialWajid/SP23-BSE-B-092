const session = require("express-session");

const sessionMiddleware = session({
  secret: "my_session_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
});
const setUserSession = (req, user) => {
  req.session.userId = user._id; // Store user ID in session
  req.session.userRole = user.role; // Optional: store user role
  req.session.isLoggedIn = true; // Optional: mark user as logged in
};

const deleteUserSession = (req) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
    }
  });
};

module.exports = { sessionMiddleware, setUserSession, deleteUserSession };
