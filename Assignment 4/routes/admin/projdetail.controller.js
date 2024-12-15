const express = require("express");
const router = express.Router();
const Project = require("../../model/project.model");
const { authMiddleware } = require("../../middleware/verified");

router.get("/", async (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect("/user-login"); // Redirect if not logged in
  }
  try {
    const projects = await Project.find();
    let isLoggedIn = true;
    return res.render("project", {
      layout: "Layout",
      projects: projects,
      isLoggedIn: isLoggedIn, // Pass the isLoggedIn variable to the view
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Error fetching projects from the database.");
  }
});

module.exports = router;
