const express = require("express");
const router = express.Router();
const Category = require("../model/category.model");

router.get("/women", async (req, res) => {
  try {
    const categories = await Category.find({ type: "Women" });

    const heroContent = {
      dynamicHeading: "Women's",
    };

    const dynamicCards = categories.map((category) => ({
      link: category.linkName,
      image: `/images/${category.imageName}`,
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
