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

router.get("/shoes", async (req, res) => {
  try {
    const heading = {
      title: "Party Season",
      subtitle: "Our top picks, whatever the RSVP!",
      buttonText: "Shop Partywear",
    };

    const dynamicCards = [
      {
        link: "/velvet-bow-heels",
        image:
          "https://res.cloudinary.com/do35a2aay/image/upload/v1733663050/categoryImage/1733663049657_shoes.avif.jpg",
        alt: "Velvet Bow Heels",
        text: "VELVET BOW HEELS",
        price: "£16.00",
        colors: "2 colours",
      },
      {
        link: "/sequin-midi-dress",
        image:
          "https://res.cloudinary.com/do35a2aay/image/upload/v1733662984/categoryImage/1733662984002_bags.jpg.jpg",
        alt: "Sequin Long Sleeve Midi Dress",
        text: "SEQUIN LONG SLEEVE MIDI DRESS",
        price: "£25.00",
        colors: "1 colour",
      },
    ];

    // Specify the layout and pass data to the view
    res.render("productsIndex", {
      heading,
      dynamicCards,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering partywear page: " + err.message);
  }
});

module.exports = router;
