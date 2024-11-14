const express = require("express");
const router = express.Router();

router.get("/admin/products/create", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminLayout",
    pageTitle: "Products Management",
  });
});

module.exports = router;
