const express = require("express");
const router = express.Router();
const Category = require("../model/category.model");

router.get("/kids", async (req, res) => {
  try {
    const categories = await Category.find({ type: "Kids" });

    const heroContent = {
      dynamicHeading: "Kid's",
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
router.get("/category/kids/:itemType", async (req, res) => {
  try {
    const { itemType } = req.params;

    const heading = {
      title: itemType.charAt(0).toUpperCase() + itemType.slice(1),
      subtitle: `Our top picks for ${itemType}`,
    };

    const products = await Product.find({
      categoryType: "Kids",
      itemType: itemType,
    });

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
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering category page: " + err.message);
  }
});

module.exports = router;