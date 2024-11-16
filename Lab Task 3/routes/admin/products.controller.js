const express = require("express");
const router = express.Router();

const Product = require("../../model/product.model");

router.post("/admin/product-details", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/admin/product-details");
  } catch (err) {
    res.status(500).send("Error saving product: " + err.message);
  }
});

router.get("/admin/products/create", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminLayout",
    pageTitle: "Create Product",
  });
});

module.exports = router;
