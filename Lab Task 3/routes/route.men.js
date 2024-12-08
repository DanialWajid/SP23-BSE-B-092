const express = require("express");
const router = express.Router();
const Category = require("../model/category.model");

router.get("/men", async (req, res) => {
  try {
    const categories = await Category.find({ type: "Men" });

    const heroContent = {
      dynamicHeading: "Mens's",
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

module.exports = router;
