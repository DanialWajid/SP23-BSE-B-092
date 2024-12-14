const session = require("express-session");

const sessionMiddleware = session({
  secret: "my_session_secret_key", // Secret for signing the session ID cookie
  resave: false, // Don't save session if not modified
  saveUninitialized: false, // Don't create a session until something is stored
  cookie: {
    secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
    maxAge: 7 * 3600000,
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
