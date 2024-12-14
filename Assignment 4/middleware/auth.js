// Authentication Middleware with Verification Check

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // `req.user` is already set by isAuthenticated

    if (!user) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this page" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this page" });
    }

    return next(); // User has the right role, proceed to the next middleware/route handler
  };
}
async function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.verified) {
        return res
          .status(403)
          .json({ message: "Please verify your email to continue" });
      }

      req.user = user; // Attach user data to request object
      return next(); // Proceed if the user is authenticated and verified
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this page" });
  }
}

// Exporting the middlewares to use in other parts of the app
module.exports = { isAuthenticated, authorizeRole };
