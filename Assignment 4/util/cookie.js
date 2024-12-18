const session = require("express-session");
const flash = require("connect-flash");

const sessionMiddleware = session({
  secret: "my_session_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

const flashMiddleware = (req, res, next) => {
  res.locals.messages = req.flash();
  next();
};

const deleteUserSession = (req, res) => {
  req.flash("success", "You have been logged out successfully!");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error while destroying session:", err);
      req.flash("error", "An error occurred while logging you out.");
      return res.redirect("/error-page");
    }
    res.redirect("/login");
  });
};

module.exports = { sessionMiddleware, flashMiddleware, deleteUserSession };
