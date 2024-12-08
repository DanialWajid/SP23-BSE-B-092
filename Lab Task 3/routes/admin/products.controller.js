const express = require("express");
const router = express.Router();
const Category = require("../../model/category.model");

const Product = require("../../model/product.model");

router.post("/product-details", async (req, res) => {
  try {
    const {
      name,
      price,
      sizesAvailable, // This will already be an array
      categoryType,
      itemType,
      colors, // This will also be an array
      image1,
      image2,
    } = req.body;

    // Ensure sizesAvailable and colors are arrays (if not selected, they will be empty arrays)
    const sizesArray = Array.isArray(sizesAvailable)
      ? sizesAvailable
      : sizesAvailable
      ? [sizesAvailable]
      : [];
    const colorsArray = Array.isArray(colors) ? colors : colors ? [colors] : [];

    // Create a new product instance using the data from the form
    const product = new Product({
      name,
      price,
      sizesAvailable: sizesArray, // Store the sizes array directly
      categoryType,
      itemType,
      colors: colorsArray, // Store the colors array directly
      image1, // assuming you're handling the image upload separately
      image2,
    });

    // Save the product to the database
    await product.save();

    // Redirect after successful creation
    res.redirect("/admin/product-details");

    // Send a response back to the client (in case of an API call)
    // res.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
});

router.get("/admin/products/create", (req, res) => {
  return res.render("admin/createForm", {
    layout: "adminLayout",
    pageTitle: "Create Product",
  });
});

router.get("/get-item-types", async (req, res) => {
  const { type } = req.query; // Get category type from the query string
  console.log("type", type); // Log to check if type is received correctly

  try {
    // Find categories matching the provided type
    const categories = await Category.find({ type });

    // Extract the category names and send them as the response
    const itemTypes = categories.map((category) => category.categoryName); // Use categoryName here

    res.json(itemTypes);
  } catch (error) {
    console.error("Error fetching item types:", error);
    res.status(500).json({ error: "Error fetching item types" });
  }
});

module.exports = router;
