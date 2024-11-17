const express = require("express");
const router = express.Router();
const Project = require("../../model/project.model");

router.get("/project", async (req, res) => {
  try {
    const projects = await Project.find();

    return res.render("project", {
      layout: "Layout",
      projects: projects,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
});

module.exports = router;
