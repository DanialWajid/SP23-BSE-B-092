const express = require("express");
const router = express.Router();
const Category = require("../model/category.model");
const Product = require("../model/product.model");

router.get("/women", async (req, res) => {
  try {
    const categories = await Category.find({ type: "Women" });

    const heroContent = {
      dynamicHeading: "Women's",
    };

    const dynamicCards = categories.map((category) => ({
      link: category.linkName,
      image: category.categoryImage,
      alt: category.categoryName,
      text: category.categoryName.toUpperCase(),
    }));

    res.render("index", { heroContent, dynamicCards });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching categories: " + err.message);
  }
});
router.get("/:itemType", async (req, res) => {
  try {
    const { itemType } = req.params; // Get the itemType from the URL

    const heading = {
      title: itemType.charAt(0).toUpperCase() + itemType.slice(1), // Capitalize first letter
      subtitle: `Our top picks for ${itemType}`,
    };

    // Query the database for products with the given categoryType and itemType
    const products = await Product.find({
      categoryType: "Women", // Hardcoded categoryType ("Women") as an example
      itemType: itemType, // Dynamically use itemType from URL
    });

    // Create dynamicCards from the database results
    const dynamicCards = products.map((product) => ({
      link: `/products/${product._id}`, // Link to the product details page
      image: product.productImage, // Assuming 'productImage' is stored in the database
      alt: product.name,
      text: product.name.toUpperCase(), // Product name in uppercase
      price: `£${product.price}`,
      colors: `${product.colors.length} colours`, // Assuming 'colors' is an array of color options
    }));

    // Render the products page, passing the heading and dynamicCards to the view
    res.render("productsIndex", {
      heading,
      dynamicCards,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering category page: " + err.message);
  }
});

module.exports = router;
