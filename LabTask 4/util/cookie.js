const session = require("express-session");

const sessionMiddleware = session({
  secret: "my_session_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

const deleteUserSession = (req) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
    }
  });
};

module.exports = { sessionMiddleware, deleteUserSession };
