const authMiddleware = (req, res, next) => {
  // Check if the user is already logged in and has the required role
  if (
    req.session.userRole === "Admin" ||
    req.session.userRole === "SuperAdmin"
  ) {
    return next(); // Allow the request to proceed
  }

  // If not authenticated, redirect to the login page
  return res.redirect("/");
};

module.exports = { authMiddleware };
