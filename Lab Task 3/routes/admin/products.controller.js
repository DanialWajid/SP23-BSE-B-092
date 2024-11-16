const express = require("express");
const router = express.Router();

// Adjust the path to point to the 'product' model in the 'model' folder
const Product = require("../../model/product.model"); // Assuming 'product.js' is in the 'model' folder

// Handle form submission
router.post("/admin/products", async (req, res) => {
  try {
    // Create a new product document and save to MongoDB
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(req.body);

    // Redirect or send success response
    res.redirect("/admin/product-details"); // Redirect to products page
  } catch (err) {
    res.status(500).send("Error saving product: " + err.message);
  }
});

router.get("/admin/products/create", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminLayout",
    pageTitle: "Products Management",
  });
});

module.exports = router;
