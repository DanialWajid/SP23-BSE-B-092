// Authorization Middleware (checks user role and verification)
function authorizeRole(allowedRoles) {
  return async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).send("You must be logged in to access this page");
    }

    try {
      const user = await User.findById(req.session.userId);

      if (!user) {
        return res.status(401).send("User not found");
      }

      // Check if the user is verified
      if (!user.verified) {
        return res
          .status(403)
          .send("Please verify your email to access this page");
      }

      // Check if the user has the right role
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .send("You do not have permission to access this page");
      }

      // Attach user to the request object
      req.user = user;

      return next(); // Proceed to next middleware/route handler
    } catch (err) {
      return res.status(500).send("Server error");
    }
  };
}
