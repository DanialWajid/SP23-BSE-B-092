const authMiddleware = (req, res, next) => {
  if (
    req.session.userRole === "Admin" ||
    req.session.userRole === "SuperAdmin"
  ) {
    return next(); // Allow the request to proceed
  }

  // If not authenticated, redirect to the login page
  return res.redirect("/");
};
const Superauth = (req, res, next) => {
  if (req.session.userRole === "SuperAdmin") {
    return next();
  }

  res.send(`
    <html>
      <body>
        <script>
          alert("You are unauthorized to access this page.");
          window.location.href = "/";
        </script>
      </body>
    </html>
  `);
};

module.exports = { Superauth, authMiddleware };
