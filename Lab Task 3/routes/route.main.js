const express = require("express");
const router = express.Router();

router.get("/main", (req, res) => {
  const heroContent = {
    dynamicHeading: "We are Primark",
    dynamicParagraph: "At Primark, there's something for everyone",
  };

  const dynamicCards = [
    {
      link: "/women",
      image: "/images/Wk 52 - Womens  - Landing Tile copy.avif",
      alt: "Women",
      text: "WOMEN",
    },
    {
      link: "#",
      image: "/images/Wk 52 - Kids - Landing Tile copy.avif",
      alt: "Kids",
      text: "KIDS",
    },
    {
      link: "#",
      image: "/images/Wk 46 - Click & Collect - Landing Tile 02_ copy.avif",
      alt: "Click & Collect",
      text: "CLICK & COLLECT",
    },
    {
      link: "#",
      image: "/images/Wk 52 - Baby - Landing Tile 02 copy.avif",
      alt: "Baby",
      text: "BABY",
    },
    {
      link: "#",
      image: "/images/Wk 52 - Home  - Landing Tile copy.avif",
      alt: "Home",
      text: "HOME",
    },
    {
      link: "#",
      image: "/images/Wk 52 - Mens - Landing Tile_ copy.avif",
      alt: "Men",
      text: "MEN",
    },
  ];

  res.render("index", { heroContent, dynamicCards });
});

module.exports = router;
