const express = require("express");
let router = express.Router();
router.get("/admin/product-details", (req, res) => {
  let products = [
    {
      _id: 1,
      name: "T-Shirt",
      type: "tshirt",
      description: "Cotton T-Shirt with Graphic Design",
      price: 25,
    },
    {
      _id: 2,
      name: "Jeans",
      type: "jeans",
      description: "Slim Fit Blue Jeans",
      price: 40,
    },
    {
      _id: 3,
      name: "Jacket",
      type: "jacket",
      description: "Winter Jacket with Hood",
      price: 60,
    },
    {
      _id: 4,
      name: "Sweater",
      type: "sweater",
      description: "Warm Woolen Sweater",
      price: 35,
    },
  ];

  return res.render("./admin/products", {
    layout: "adminLayout",
    pageTitle: "Product Details",
    products,
  });
});

module.exports = router;
