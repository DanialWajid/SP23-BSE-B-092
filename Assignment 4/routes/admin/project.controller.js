const express = require("express");

const router = express.Router();

const project = require("../../model/project.model");

router.get("/", async (req, res) => {
  console.log(req.session.userEmail);
  if (!req.session.userEmail) {
    return res.redirect("/user-login"); // Redirect if not logged in
  }
  res.render("project");
});

router.post("/project/projectDetails", async (req, res) => {
  try {
    const projectBody = new project(req.body);

    await projectBody.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error saving product: " + err.message);
  }
});

router.get("/admin/create-project", (req, res) => {
  return res.render("project/projectCreate", {
    layout: "adminLayout",
    pageTitle: "Create Project",
  });
});

module.exports = router;
