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
      link: `/category/women/${category.linkName}`,
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
router.get("/category/Women/:itemType", async (req, res) => {
  try {
    const { itemType } = req.params;
    const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter, default to 1 if not provided
    const itemsPerPage = 3; // Number of products per page

    const heading = {
      title: itemType.charAt(0).toUpperCase() + itemType.slice(1),
      subtitle: `Our top picks for ${itemType}`,
    };

    // Get the total number of products in the "Women" category for the given itemType
    const totalProducts = await Product.countDocuments({
      categoryType: "Women",
      itemType: itemType,
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Get the products for the current page
    const products = await Product.find({
      categoryType: "Women",
      itemType: itemType,
    })
      .skip((page - 1) * itemsPerPage) // Skip the products from previous pages
      .limit(itemsPerPage); // Limit the number of products to the itemsPerPage

    const dynamicCards = products.map((product) => ({
      link: `/products/${product._id}`,
      image: product.productImage,
      alt: product.name,
      text: product.name.toUpperCase(),
      price: `£${product.price}`,
      colors: `${product.colors.length} colours`,
    }));

    res.render("productsIndex", {
      heading,
      dynamicCards,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering category page: " + err.message);
  }
});

module.exports = router;
