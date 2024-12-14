const express = require("express");
const router = express.Router();
const Project = require("../../model/project.model");

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    return res.render("project", {
      layout: "Layout",
      projects: projects,
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Error fetching projects from the database.");
  }
});

module.exports = router;
