const express = require("express");
const router = express.Router();
const Product = require("../../model/product.model"); // Make sure to import the Product model

// Route to fetch and display products
router.get("/admin/product-details", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Fetched products:", products); // Debugging log

    return res.render("admin/products", {
      layout: "adminLayout",
      pageTitle: "Products Management",
      products: products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
});

module.exports = router;
